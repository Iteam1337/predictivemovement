import logger
import logging
import traceback
import pika
import time

from pika.exceptions import ChannelWrongStateError
from MQBindings import MQBindings


class MQConnect():
    """
    This class creates a connection to the MQ.
    """

    def __init__(self):
        self.log = logger.create(self.__class__.__name__)

        self.connection = None
        self.channel = None
        self.identifier = None

    def init(self, identifier=None):
        self.set_identifier(identifier)
        self._connect()
        return self

    def set_identifier(self, identifier):
        if identifier is None:
            self.identifier = time.time()
        else:
            self.identifier = identifier

    def _connect(self):
        parameters = pika.ConnectionParameters(host="localhost")
        self.connection = pika.BlockingConnection(parameters)
        self.channel = self.connection.channel()
        self.log.debug(f"Connection to Rabbit MQ established (identifier: {self.identifier}).")

    def bind(self, bindings: MQBindings):
        self.channel.queue_declare(queue=bindings.queue_name)
        self.channel.exchange_declare(exchange=bindings.exchange_name,
                                      exchange_type=bindings.exchange_type)
        self.channel.queue_bind(exchange=bindings.exchange_name,
                                queue=bindings.queue_name,
                                routing_key=bindings.routing_key)

        self.log.debug(
            f"Queue '{bindings.queue_name}' created and bound to '{bindings.exchange_name}' (identifier: {self.identifier}).")

    def close(self):
        try:
            self.connection.close()
        except ChannelWrongStateError:
            pass

        self.log.debug(f"Connection to Rabbit MQ closed (identifier: {self.identifier}).")
