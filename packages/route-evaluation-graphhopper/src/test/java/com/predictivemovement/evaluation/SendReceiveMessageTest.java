package com.predictivemovement.evaluation;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * This live test requires:
 * 
 * - A running RabbitMQ instance on localhost
 */
@SpringBootTest
public class SendReceiveMessageTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void sendMessage() {
        rabbitTemplate.convertAndSend("graphhopper", "Here we go!");
    }
}