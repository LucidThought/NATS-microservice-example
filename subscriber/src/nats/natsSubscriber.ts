import {
  AckPolicy,
  JSONCodec,
  JetStreamClient,
  JetStreamPullSubscription,
  NatsConnection,
  connect
} from "nats";
import constants from "../constants";

export class NatsSubscriber {
  private js: JetStreamClient | undefined;
  private psub: JetStreamPullSubscription | undefined;
  private nc: NatsConnection | undefined;
  private jsonCodec = JSONCodec();

  async configureStreamManager() {
    console.log("Configure Stream")
    this.nc = await connect({
      servers: [
        "nats://n1:4222",
        "nats://n2:4222",
        "nats://n3:4222"
      ]
    });
    // Create the JetStreamManager and add applicable streams
    const jsm = await this.nc.jetstreamManager();
    await jsm.streams.add(
      { name: constants.streamName, subjects: constants.subjectList },
    );

    this.js = this.nc.jetstream();
    console.log("Stream Configured")
  }

  async configurePullSubscription() {
    console.log("Configure Pull Subscription");
    this.psub = await this.js!.pullSubscribe(constants.subjectList[0], {
      mack: true,
      config: {
        durable_name: constants.durableConsumerName,
        ack_policy: AckPolicy.Explicit,
        ack_wait: 4000,
      },
    });
    console.log("Pull Subscription Configured");
  }

  async pullSubscribe() {
    console.log("Reading New Messages");
    (async () => {
      for await (const m of this.psub!) {
        console.log(
          `[${m.seq}] ${
            m.redelivered ? `- redelivery ${m.info.redeliveryCount}` : ""
          }`,
        );
        console.log(this.jsonCodec.decode(m.data));
        m.ack();
        /*
         * The work to be done on each payload of data coming through NATS
         * should around happen here. The possibility of ignoring redelivered messages
         * or relagating them to some sort of 'dead letter' queue could happen
         * here as well.
         *
         * The question of acknowledging the receipt of this message before or after the
         * work is done for this message is an implementation detail. I personally think
         * that ack() should happen before work is attempted, and errors in that work should
         * be handled explicitly. Until a message is acknowledged it could be redelivered,
         * which intoduces a need to handle redelivered messages by parsing redeliveryCount.
         */
      }
    })();
  }

  public startPulling() {
    console.log("Start Pulling!");
    this.pullSubscribe();

    const fn = () => {
      console.log("[PULL]");
      this.psub!.pull({ batch: constants.messageBatchSize, expires: constants.pullExpiresMs });
    };

    fn();// initial pull
    // repeat every 'pullIntervalMs' milliseconds
    const interval = setInterval(fn, constants.pullIntervalMs);

    // setTimeout(() => {
    //   clearInterval(interval);
    //   this.nc!.drain();
    // }, 20000);
  }
}