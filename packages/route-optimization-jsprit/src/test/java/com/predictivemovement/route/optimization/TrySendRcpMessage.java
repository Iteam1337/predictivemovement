package com.predictivemovement.route.optimization;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

//@SpringBootApplication
// @SpringBootTest
public class TrySendRcpMessage {

    // public static void main(final String[] args) {
    // SpringApplication.run(TrySendRcpMessage.class, args);
    // }

    @Autowired
    private RabbitTemplate template;

    @Autowired
    private DirectExchange exchange;

    // @Test
    public void send() {
        String msg = "Wie man in den Wald hinein ruft, so schallt es heraus";
        System.out.println("tpl: " + template);
        System.out.println("exc: " + exchange);
        System.out.println("exc: " + exchange.getName());

        Object response = template.convertSendAndReceive(exchange.getName(), "rpc", msg);
        System.out.println("----> " + response);
    }
}