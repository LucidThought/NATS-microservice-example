import { NatsController } from "./nats/natsHandler";

class MessagePuller {
  private natsHandler = new NatsController

  async run() {
    await this.natsHandler.configureStreamManager();

    await this.natsHandler.configurePullSubscription();

    this.natsHandler.startPulling();
  }
}

let listener = new MessagePuller();

listener.run();