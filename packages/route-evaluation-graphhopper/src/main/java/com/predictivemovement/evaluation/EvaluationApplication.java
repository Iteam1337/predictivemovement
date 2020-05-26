package com.predictivemovement.evaluation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EvaluationApplication {

	private static final boolean NON_DURABLE = false;
	private static final String QUEUE_NAME = "graphhopper";
	private static final String BOOKINGS_ROUTING_KEY = "new";

	Logger log = LoggerFactory.getLogger(EvaluationApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(EvaluationApplication.class, args);
	}

	@Bean
	TopicExchange topicExchange() {
		return new TopicExchange("bookings");
	}

	@Bean
	public Queue graphhopperQueue() {
		return new Queue(QUEUE_NAME, NON_DURABLE);
	}

	@Bean
	public Binding bindingToBookings(TopicExchange topicExchange, Queue graphhopperQueue) {
		return BindingBuilder.bind(graphhopperQueue).to(topicExchange).with(BOOKINGS_ROUTING_KEY);
	}

	@RabbitListener(queues = QUEUE_NAME)
	public void listen(String msg) {
		log.info("Message read from queue : " + msg);
	}
}