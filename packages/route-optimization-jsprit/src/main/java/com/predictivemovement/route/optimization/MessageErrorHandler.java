package com.predictivemovement.route.optimization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.listener.api.RabbitListenerErrorHandler;
import org.springframework.amqp.rabbit.support.ListenerExecutionFailedException;

/**
 * This class...
 */
public class MessageErrorHandler implements RabbitListenerErrorHandler {

    static final Logger log = LoggerFactory.getLogger(MQApplication.class);

    @Override
    public Object handleError(Message amqpMessage, org.springframework.messaging.Message<?> message,
            ListenerExecutionFailedException exception) throws Exception {
        log.error("Error occured!", exception);

        // set reject flag?
        // message.getHeaders().get(AmqpHeaders.CHANNEL, Channel.class)
        // .basicReject(message.getHeaders().get(AmqpHeaders.DELIVERY_TAG, Long.class),
        // true);

        // System.out.println("1:" + exception);
        // System.out.println("2:" + exception.getCause());
        // System.out.println("3:" + exception.getClass());
        // System.out.println("4:" + exception.getMessage());

        RouteOptimizationException routeOptimizationException = (RouteOptimizationException) exception.getCause();
        String errorResponse = new ErrorResponse(routeOptimizationException).create();
        // System.out.println("errorResponse: " + errorResponse);
        return errorResponse;
    }
}