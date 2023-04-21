import {
  AckPolicy,
  JetStreamClient,
  JetStreamPullSubscription,
  NatsConnection,
  connect
} from "nats";

export class NatsController {
  private js: JetStreamClient | undefined;
  private psub: JetStreamPullSubscription | undefined;
  private nc: NatsConnection | undefined;

  private stream = "STREAM";
  private subj = "SUBJECT";
  private durable = "DURABLE";

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
      { name: this.stream, subjects: [this.subj] },
    );

    this.js = this.nc.jetstream();
    console.log("Stream Configured")
  }

  async configurePullSubscription() {
    console.log("Configure Pull Subscription");
    this.psub = await this.js!.pullSubscribe(this.subj, {
      mack: true,
      config: {
        durable_name: this.durable,
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
        // if (m.seq % 2 === 0) {
          m.ack();
        // }
      }
    })();
  }



  private fn = () => {
    console.log("[PULL]");
    this.psub!.pull({ batch: 1000, expires: 10000 });
  };

  public startPulling() {
    console.log("Start Pulling!");
    this.pullSubscribe();

    // do the initial pull
    this.fn();
    // and now schedule a pull every so often
    const interval = setInterval(this.fn, 10000); // and repeat every 2s

    // setTimeout(() => {
    //   clearInterval(interval);
    //   this.nc!.drain();
    // }, 20000);
  }
}