package com.predictivemovement.route.optimization;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.listener.api.RabbitListenerErrorHandler;
import org.springframework.amqp.rabbit.support.ListenerExecutionFailedException;

/**
 * This class...
 */
public class RabbitErrorHandler implements RabbitListenerErrorHandler {

    @Override
    public Object handleError(Message amqpMessage, org.springframework.messaging.Message<?> message,
            ListenerExecutionFailedException exception) throws Exception {
        System.out.println("----------> RabbitErrorHandler was called");
        throw exception;
        // return "{\"foo\":\"error\"}";
    }
}