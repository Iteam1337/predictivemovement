package com.predictivemovement.route.optimization;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * This class listens for incoming route requests.
 */
@SpringBootApplication
public class MQApplication {

	static final Logger log = LoggerFactory.getLogger(MQApplication.class);

	private static final String QUEUE_NAME = "calculate_route_optimization";

	public static void main(final String[] args) {
		SpringApplication.run(MQApplication.class, args);
	}

	@Bean
	public Queue queue() {
		return new Queue(QUEUE_NAME, false);
	}

	@Bean
	public DirectExchange exchange() {
		return new DirectExchange("Foo");
	}

	@Bean
	public Binding binding(DirectExchange exchange, Queue queue) {
		return BindingBuilder.bind(queue).to(exchange).with("rpc");
	}

	@Bean
	public MessageErrorHandler messageErrorHandler() {
		return new MessageErrorHandler();
	}

	@RabbitListener(queues = QUEUE_NAME, errorHandler = "messageErrorHandler", returnExceptions = "true")
	public String listen(final String msg) throws Exception {
		log.info("Message read from queue: {}", msg);

		JSONObject routeRequest = new JSONObject(msg);
		RouteOptimization routeOptimization = new RouteOptimization();
		VRPSolution vrpSolution = routeOptimization.calculate(routeRequest);
    
		StatusResponse statusResponse = new StatusResponse(vrpSolution);
		String response = statusResponse.toString();

		log.info("Publishing result: {}", response);
		return response;
	}
}
