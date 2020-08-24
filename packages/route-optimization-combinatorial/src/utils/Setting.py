import json
import re
import os

from datetime import datetime
from pathlib import Path

import utils.logger as logger


class Setting:
    """
    This class loads and keeps a JSON setting configuration file.
    You can referecne env as values by ${...}, e.g. "password": "${PASSWORD}".
    """

    def __init__(self):
        self.log = logger.create(self.__class__.__name__)

        self.file_path = None
        self.data = None
        self.runtime_id = None
        self.save_path = None

    def init(self, file_path):
        self.file_path = Path(file_path)
        self.__is_configuration_file()
        self.__read_configuration_file()
        self.__set_env(self.data)
        self._set_references(self.data)
        return self

    def __is_configuration_file(self):
        if not self.file_path.is_file():
            raise FileNotFoundError("Setting file is not a file or "
                                    f"not found: {self.file_path.resolve()}")

    def __read_configuration_file(self):
        with open(self.file_path) as json_file:
            self.log.info(
                f"Reading setting from: {self.file_path.resolve()}")
            self.data = json.load(json_file)

    def __set_env(self, dictionary):
        '''
            Replace all env markers ${...} with env variables in the
            setting file.
        '''
        for key, value in dictionary.items():
            if isinstance(value, dict):
                dictionary[key] = self.__set_env(value)
            else:
                if isinstance(value, str):
                    match = re.match(r'\${(.+)}', value)
                    if match:
                        dictionary[key] = os.environ[match.group(1)]
        return dictionary

    def _set_references(self, dictionary):
        '''
            Replace all reference markers #{...} with variables in the
            setting file.
        '''
        for key, value in dictionary.items():
            if isinstance(value, dict):
                dictionary[key] = self._set_references(value)
            else:
                if isinstance(value, str):
                    match = re.match(r'.*\#{(.+)}.*', value)
                    if match:
                        path = match.group(1)
                        path = path.split("->")
                        path_value = self._get_value_from_setting_path(
                            path, self.data)
                        dictionary[key] = value.replace(
                            "#{"+match.group(1)+"}", path_value)
        return dictionary

    def _get_value_from_setting_path(self, path, dictionary):
        for key in path:
            dictionary = dictionary[key]
        return dictionary
