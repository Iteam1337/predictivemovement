# Route Evalutaion Graphhopper

## Developer

You can build the project with Gradle: `./gradlew clean build`

You need to have a RabbitMQ running on localhost before you start the project.

You can run the project with:`./gradlew bootRun`

You can test the running project with:

```bash
./gradlew test --rerun-tasks --tests com.predictivemovement.evaluation.SendReceiveMessageTest
```

A log output can be seen when a message is received.

Alternative you can start the project with: `docker-compose build` and `docker-compose up`

[Spring AMQP](https://docs.spring.io/spring-amqp/reference/html/) and [Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html) is used.
