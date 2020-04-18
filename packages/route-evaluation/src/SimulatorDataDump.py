import logger
import logging
import traceback
import pika

from pika.exceptions import ChannelWrongStateError
from DataDumpFile import DataDumpFile


class SimulatorDataDump():
    """
    This class consumes messages from the MQ and dumps them to a file.
    """

    def __init__(self, mq_exchange_name, data_dump_file: DataDumpFile):
        self.log = logger.create(self.__class__.__name__, logging.DEBUG)

        self.exchange_name = mq_exchange_name
        self.queue_name = "simulator_data_dump_" + self.exchange_name

        self.data_dump_file = data_dump_file

        self.connection = None
        self.channel = None

    def init(self):
        self._connect()
        self._bind_queue()
        return self

    def _connect(self):
        parameters = pika.ConnectionParameters(host="localhost")
        self.connection = pika.BlockingConnection(parameters)
        self.log.info("Connection to Rabbit MQ established for exchange {}.".format(self.exchange_name))

    def _bind_queue(self):
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.queue_name)
        self.channel.queue_bind(exchange=self.exchange_name, queue=self.queue_name)

        self.log.info("Queue '{}' created and bound to '{}'.".format(self.queue_name, self.exchange_name))

    def dump_to_json(self, number_of_messages=10):
        received_msg_counter = 0

        try:
            self.log.info("Waiting for messages. I will close after receiving {} messages or if you press CTRL+C'"
                          .format(number_of_messages))

            for method_frame, properties, body in self.channel.consume(self.queue_name):
                received_msg_counter += 1

                self.data_dump_file.write(body)

                self.channel.basic_ack(method_frame.delivery_tag)

                if received_msg_counter == number_of_messages:
                    break

        except KeyboardInterrupt:
            pass
        except Exception as e:
            track = traceback.format_exc()
            self.log.error(track)

    def close(self):
        self.channel.queue_delete(queue=self.queue_name)

        requeued_messages = self.channel.cancel()
        self.log.info('Requeued %i messages' % requeued_messages)

        try:
            self.connection.close()
        except ChannelWrongStateError:
            pass

        self.log.info("Connection to Rabbit MQ closed and queue removed for exchange {}.".format(self.exchange_name))
