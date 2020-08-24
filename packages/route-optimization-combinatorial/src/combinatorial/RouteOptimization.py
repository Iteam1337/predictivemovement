import utils.logger as logger

from utils.Setting import Setting
from utils.Timer import MeasureBlockTime


class RouteOptimization:
    """
    This class starts the route optimization calculation for a given route 
    request and returns route solutions as a response.
    """

    def __init__(self):
        self.log = logger.create(self.__class__.__name__)

        self.setting = None
        self.route_solutions = None

    def init(self, setting: Setting):
        self.setting = setting
        return self

    def calculate(self, route_request):
        with MeasureBlockTime("Combinatorial route optimization"):
            self.log.debug("Starting combinatorial route optimization"
                           f" for request: {route_request}")

            # TODO call you calculation classes here
            self.route_solutions = {
                "json response here": "see tests for structure"
            }

            self.log.debug("Combinatorial route optimization finished"
                           f" with response: {self.route_solutions}")
            return self.route_solutions
