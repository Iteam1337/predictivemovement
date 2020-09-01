{application,broadway_rabbitmq,
             [{applications,[kernel,stdlib,elixir,lager,logger,broadway,amqp]},
              {description,"A RabbitMQ connector for Broadway"},
              {modules,['Elixir.BroadwayRabbitMQ.AmqpClient',
                        'Elixir.BroadwayRabbitMQ.Backoff',
                        'Elixir.BroadwayRabbitMQ.Producer',
                        'Elixir.BroadwayRabbitMQ.RabbitmqClient']},
              {registered,[]},
              {vsn,"0.6.0"}]}.
