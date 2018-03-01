# docker-nodejs-postgresql-rabbitmq-example
Its a demo Dockerized project using nodeJS, PostgreSql and RabbitMQ. Publisher service publish json messages to RabbitMQ Queue and consumer service receive the messages by providing proper credentials and store it into the DB. A API is also exposed to get the Array of stored data.

## To Run
```
1. docker-compose build
2. docker-compose up
```

## To GET Data

```Hit URL localhost:3000```

## To Shutdown

```docker-compose down```
