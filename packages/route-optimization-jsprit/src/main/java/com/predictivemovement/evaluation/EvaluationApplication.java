package com.predictivemovement.evaluation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EvaluationApplication {

	private static final boolean NON_DURABLE = false;
	private static final String QUEUE_NAME = "route_optimization_jsprit";

	Logger log = LoggerFactory.getLogger(EvaluationApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(EvaluationApplication.class, args);
	}

	@Bean
	public Queue graphhopperQueue() {
		return new Queue(QUEUE_NAME, NON_DURABLE);
	}

	@Bean
	public DirectExchange exchange() {
		return new DirectExchange("");
	}

	@Bean
	public Binding binding(DirectExchange exchange, Queue queue) {
		return BindingBuilder.bind(queue)
                .to(exchange)
                .with("rpc");
	}

	@RabbitListener(queues = QUEUE_NAME)
	public String listen(String msg) {
		log.info("Message read from queue: " + msg);

		RouteOptimization routeOptimization = new RouteOptimization();
		msg = routeOptimization.calculate(msg);

		return msg;
	}
}
