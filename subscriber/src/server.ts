import { NatsSubscriber } from "./nats/natsSubscriber";

class MessagePuller {
  private natsHandler = new NatsSubscriber();

  async run() {
    await this.natsHandler.configureStreamManager();

    await this.natsHandler.configurePullSubscription();

    this.natsHandler.startPulling();
  }
}

let listener = new MessagePuller();

listener.run();