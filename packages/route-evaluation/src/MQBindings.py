

class MQBindings():
    """
    This class keeps binding configurations.
    """

    def __init__(self):
        self.queue_name = None
        self.exchange_name = None
        self.exchange_type = None
        self.routing_key = None

    def init(self, queue_name, exchange_name, exchange_type, routing_key=None):
        self.queue_name = queue_name
        self.exchange_name = exchange_name
        self.exchange_type = exchange_type
        self.routing_key = routing_key
        return self
