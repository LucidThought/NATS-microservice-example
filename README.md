# NATS in Typescript Example Case

This project is a naive example of using a NATS microservice messaging system to start events in another server. Using microservices in this way increases the horizontal scalability of any system, and reduces the load for any single server. In this example NATS will be configured in a cluster to demonstrate the fault tolerance of this microservice messaging system. Having a cluster in this way also increases the flexibility in scaling the system up.

# Docker-Compose

Because this project is being built for demonstration purposes a docker-compose file is provided to start this group of systems easily on one computer. The `log.sh` and `run.sh` files are provided to easily start these systems and log their output. After you have docker and docker-compose installed to your system, you will need to install the packlage dependencies in the Typescript projects with `npm i`. You should then be able to run these (on Linux) with `./run.sh dev up` followed by `./log.sh dev -f` (The `-f` flag will force the log interface to remain in your terminal window).

## TODOs

- Separate the docker-compose files for the NATS cluster and the Pub/Sub group. Sometimes the NATS cluster doesn't initialize before the Pub/Sub systems come online and try to connect, causing a TIMEOUT error. Starting the NATS cluster and the TS Pub/Sub sytems will have to happen separately.
- Find out why messages are being delivered to the Subscriber twice (consistently). If the Sub application is pulling existing messages on the NATS queue then duplicates are not seen, but when Sub has caught up to Pub and is reading messages are they are being delivered then duplicates are read from NATS. This may not be a problem, as these duplicates can be ignored in code, but it would be nice to know why this is ocurring.
