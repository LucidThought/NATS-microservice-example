# NATS in Typescript Example Case

This project is a naive example of using a NATS microservice messaging system to start events in another server. Using microservices in this way increases the horizontal scalability of any system, and reduces the load for any single server. In this example NATS will be configured in a cluster to demonstrate the fault tolerance of this microservice messaging system. Having a cluster in this way also increases the flexibility in scaling the system up.

# Docker-Compose

Because this project is being built for demonstration purposes a docker-compose file is provided to start this group of systems easily on one computer. The `log.sh` and `run.sh` files are provided to easily start these systems and log their output. After you have docker and docker-compose installed to your system, you will need to install the packlage dependencies in the Typescript projects with `npm i`. You should then be able to run these (on Linux) with `./run.sh dev up` followed by `./log.sh dev -f` (The `-f` flag will force the log interface to remain in your terminal window).

## TODOs

- Finish parsing of messages received from NATS, as these will be byte arrays that need to be converted to JSON before they can be utilized. The NATS library has helpers to accomplish this.
- Build a `publisher` node project to publish messages to the NATS cluster. Eventually I will include instructions for spinning up multiple publishers, as this microservice messaging system will allow n publishers and m subscribers which should be able to start/stop freely without adjusting the NATS cluster.
