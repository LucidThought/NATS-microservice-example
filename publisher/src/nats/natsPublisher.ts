import { connect, Empty, JetStreamClient, JetStreamManager, NatsConnection } from "nats";

export class NatsPublisher {
  private jsm: JetStreamManager | undefined;
  private js: JetStreamClient | undefined;
  private nc: NatsConnection | undefined;

  private stream = "STREAM";
  private subj = "SUBJECT";
  private durable = "DURABLE";

  async configureConnection() {
    this.nc = await connect({
      servers: [
        "nats://n1:4222",
        "nats://n2:4222",
        "nats://n3:4222"
      ]
    });
  }

  async configureJetStreamManager() {
    this.jsm = await this.nc!.jetstreamManager();

    await this.jsm.streams.add({ name: this.stream, subjects: [this.subj] });
  }

  async publishToJetStream() {
    const js = await this.nc!.jetstream();
    // the jetstream client provides a publish that returns
    // a confirmation that the message was received and stored
    // by the server. You can associate various expectations
    // when publishing a message to prevent duplicates.
    // If the expectations are not met, the message is rejected.
    let pa = await js.publish(this.subj, Empty, {
      msgID: "a",
      expect: { streamName: this.stream },
    });
    console.log(`${pa.stream}[${pa.seq}]: duplicate? ${pa.duplicate}`);

    pa = await js.publish(this.subj, Empty, {
      msgID: "a",
      expect: { lastSequence: 1 },
    });
    console.log(`${pa.stream}[${pa.seq}]: duplicate? ${pa.duplicate}`);

    await this.jsm!.streams.delete("B");
    await this.nc!.drain();
  }


}


