import gc
import timeit
import datetime

import utils.logger as logger

from functools import wraps


log = logger.create("Timer")


def format_time(time_to_format):
    return datetime.timedelta(seconds=time_to_format)


def MeasureTime(function, disable_gc=False):
    @wraps(function)
    def _wrapper(*args, **kwargs):

        gcold = gc.isenabled()
        if disable_gc:
            gc.disable()

        start_time = timeit.default_timer()
        try:
            result = function(*args, **kwargs)
        finally:
            elapsed_time = timeit.default_timer() - start_time

            if disable_gc and gcold:
                gc.enable()

            elapsed_time = format_time(elapsed_time)
            log.debug(f'Run time for "{function.__name__}" is {elapsed_time}')
            # print(f'"{function.__name__}": {time}')

        return result
    return _wrapper


class MeasureBlockTime:

    def __init__(self, name="(block)", disable_gc=False):
        self.log = logger.create(self.__class__.__name__)
        self.name = name
        self.disable_gc = disable_gc
        self.time = None

    def __enter__(self):
        self.gcold = gc.isenabled()
        if self.disable_gc:
            gc.disable()

        self.start_time = timeit.default_timer()

    def __exit__(self, ty, val, tb):
        self.time = timeit.default_timer() - self.start_time

        if self.disable_gc and self.gcold:
            gc.enable()

        self.time = format_time(self.time)
        log.debug(f'Run time for "{self.name}" is {self.time}')
        # print(f'"{self.name}": {self.time}')

        return False  # re-raise any exceptions
