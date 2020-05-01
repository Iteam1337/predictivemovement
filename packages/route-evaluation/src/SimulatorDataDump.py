import logger
import traceback
import pika

from DataDumpFile import DataDumpFile
from MQConnect import MQConnect
from MQBindings import MQBindings


def simulator_dump(
        dump_folder,
        dump_filename,
        number_of_messages,
        mq_exchange_name,
        mq_exchange_type,
        routing_key=None):

    data_dump_file = DataDumpFile(dump_folder, dump_filename)
    data_dump = SimulatorDataDump(data_dump_file, mq_exchange_name, mq_exchange_type, routing_key).init()
    data_dump.dump_to_json(number_of_messages)
    data_dump.close()


class SimulatorDataDump():
    """
    This class consumes messages from the MQ and dumps them to a file.
    """

    def __init__(self, data_dump_file: DataDumpFile, mq_exchange_name, exchange_type, routing_key=None):
        self.log = logger.create(self.__class__.__name__)

        self.data_dump_file = data_dump_file

        queue_name = "simulator_data_dump_" + mq_exchange_name
        self.bindings = MQBindings().init(queue_name, mq_exchange_name, exchange_type, routing_key)

        self.mq = None

    def init(self):
        self.mq = MQConnect().init()
        self.mq.bind(self.bindings)
        return self

    def dump_to_json(self, number_of_messages=10):
        received_msg_counter = 0

        try:
            self.log.info(
                f"Waiting for messages. I will close after receiving {number_of_messages} messages or if you press CTRL+C'")

            for method_frame, properties, body in self.mq.channel.consume(self.bindings.queue_name):
                received_msg_counter += 1

                self.data_dump_file.write(body)

                self.mq.channel.basic_ack(method_frame.delivery_tag)

                if received_msg_counter == number_of_messages:
                    break

        except KeyboardInterrupt:
            pass
        except Exception as e:
            track = traceback.format_exc()
            self.log.error(track)

    def close(self):
        self.mq.channel.queue_delete(queue=self.bindings.queue_name)
        self.log.info(f"Queue {self.bindings.queue_name} removed for exchange {self.bindings.exchange_name}.")

        requeued_messages = self.mq.channel.cancel()
        self.log.info("Requeued %i messages" % requeued_messages)

        self.mq.close()
