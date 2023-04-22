# NATS in Typescript Example Case

This project is a naive example of using a NATS microservice messaging system to start events in another server. Using microservices in this way increases the horizontal scalability of any system, and reduces the load for any single server. In this example NATS will be configured in a cluster to demonstrate the fault tolerance of this microservice messaging system. Having a cluster in this way also increases the flexibility in scaling the system up.

# Docker-Compose

Because this project is being built for demonstration purposes a docker-compose file is provided to start this group of systems easily on one computer. The `log.sh` and `run.sh` files are provided to easily start these systems and log their output. After you have docker and docker-compose installed to your system, you will need to install the packlage dependencies in the Typescript projects with `npm i`. You should then be able to run these (on Linux) with the following commands:
- `docker network create nats` will create a docker network over which network communication happend inside of the docker context. This command in necessary because the docker cluster, the subscribers, and the publishers are each initiated via separate docker-compose .ymls
- `./run.sh nats up` followed by `./log.sh nats -f` will start the NATS cluster in your local docker environment
- `./run.sh subscribe up` followed by `./log.sh subscribe -f` (after the NATS cluster intializes) will start the subscribers to the NATS stream and subject list
- `./run.sh publish up` followed by `./log.sh publish -f` (after the NATS cluster intializes) will start the docker systems responsible for publishing messages to the associated stream and subjects

(The `-f` flag after `log.sh` will force the log interface to remain in your terminal window)

## TODOs

- Code cleanup
- Increase the number of publishers and subscribers, possibly look at dynamically adding a variable number of both for demonstration purposes
- Make the subscriber actually do something based on the body of the message; change the message body to be useful in whatever operation that the Subscriber performs (possibly sending HTTP requests or emails)
- Add checks to get rid of type assertion flags (the ! mark beside variables); we don't want to use these variable unless they have been initialized - possibly make functions to verify this to keep with clean code?
