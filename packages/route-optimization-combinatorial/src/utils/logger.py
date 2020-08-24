import logging

from pathlib import Path


log_filename = "application.log"


def create(name, level=logging.DEBUG):
    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not len(logger.handlers):
        __init_console_logger(logger)
        __init_file_logger(logger)

    return logger


def __init_console_logger(logger):
    stream_handler = logging.StreamHandler()
    logger.addHandler(stream_handler)
    log_format = logging.Formatter(
        '{name:18s} {levelname:8s} {message}',
        style='{')
    stream_handler.setFormatter(log_format)


def __init_file_logger(logger):
    Path(log_filename).parents[0].mkdir(parents=True, exist_ok=True)
    file_handler = logging.FileHandler(log_filename)
    logger.addHandler(file_handler)
    formatter = logging.Formatter(
        '%(asctime)s %(name)-18s %(levelname)-8s %(message)s')
    file_handler.setFormatter(formatter)
