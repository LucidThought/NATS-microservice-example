import { NatsPublisher } from "./nats/natsPublisher";

class MessagePublisher {
  private natsPublisher = new NatsPublisher();

  async run() {
    console.log("Setting Up Connection");
    await this.natsPublisher.setUp();
    console.log("Connection Configured");

    console.log("Publishing Message");
    await this.natsPublisher.publishToJetStream();
  }
}

let messager = new MessagePublisher();

messager.run();

