import { connect, Empty, JetStreamClient, JetStreamManager, NatsConnection, JSONCodec } from "nats";

export class NatsPublisher {
  private configured: Boolean = false;
  private jsm: JetStreamManager | undefined;
  private js: JetStreamClient | undefined;
  private nc: NatsConnection | undefined;
  private jsonCodec = JSONCodec();

  private stream = "STREAM";
  private subj = "SUBJECT";

  private async configureConnection() {
    console.log("Configuring Connection");
    this.nc = await connect({
      servers: [
        "nats://n1:4222",
        "nats://n2:4222",
        "nats://n3:4222"
      ]
    });
    console.log("Conection Configured");
  }

  private async configureJetStreamManager() {
    console.log("Configuring JetStream");
    this.jsm = await this.nc!.jetstreamManager();

    await this.jsm.streams.add({ name: this.stream, subjects: [this.subj] });

    this.js = await this.nc!.jetstream();
    console.log("JetStream Configured");
  }

  public async setUp() {
    // Only configure the NATS connection if it has not already been configured.
    if (!this.configured) {
      await this.configureConnection();
      await this.configureJetStreamManager();
      this.configured = true;
    }
  }

  async publishToJetStream() {
    let jsMessage = {
      message: "Hello, is anyone there?",
      number: Math.floor(Math.random()*4000),
      boolean: true
    };
    // the jetstream client provides a publish that returns
    // a confirmation that the message was received and stored
    // by the server. You can associate various expectations
    // when publishing a message to prevent duplicates.
    // If the expectations are not met, the message is rejected.
    let pa = await this.js!.publish(
      this.subj,
      this.jsonCodec.encode(jsMessage),
      {
        msgID: Math.random().toString(),
        expect: { streamName: this.stream },
      }
    );
    console.log(`${pa.stream}[${pa.seq}]: {${jsMessage.number}} duplicate? ${pa.duplicate}`);
    // await this.jsm!.streams.delete("B");
    // await this.nc!.drain();
  }
}


