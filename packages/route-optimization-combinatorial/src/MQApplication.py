import utils.logger as logger

from utils.Setting import Setting
from combinatorial.RouteOptimization import RouteOptimization


class MQApplication:
    '''
    This class listens for incoming route requests and delegates them to the 
    route optimization.

    TODO create RabbitMQ queue and binding
    '''

    def __init__(self):
        self.log = logger.create(self.__class__.__name__)

        self.setting = None

    def init(self, setting: Setting):
        self.setting = setting
        print(self.setting.data["exchanges"]["cars"])
        return self

    def listen(self, route_request):
        route_optimization = RouteOptimization().init(self.setting)
        route_solutions = route_optimization.calculate(route_request)
        return route_solutions
