import logger
import logging
import json
import datetime

from pathlib import Path


class DataDumpFile():
    """
    This class writes JSON data to a file.
    """

    def __init__(self, folder, filename):
        self.log = logger.create(self.__class__.__name__, logging.DEBUG)

        self.dump_folder = folder
        self.dump_filename = filename

        self.dump_timestamp = None
        self.write_counter = 0

        self.__set_dump_timestamp()
        self.__create_dump_folder()

    def __set_dump_timestamp(self):
        now = datetime.datetime.now()
        self.dump_timestamp = now.strftime("%Y%m%d_%H%M%S")

        self.log.info("Timestamp for dump files is: {}".format(self.dump_timestamp))

    def __create_dump_folder(self):
        Path(self.dump_folder).mkdir(parents=True, exist_ok=True)
        self.log.info("Writing dump files to: {}".format(self.dump_folder))

    def create_filename(self):
        timestamp_counter = self.dump_timestamp + "_" + str(self.write_counter)
        filename = self.dump_filename.replace(".json", "_" + timestamp_counter + ".json")

        filepath = Path(self.dump_folder, filename)
        return filepath

    def write(self, json_body):
        self.write_counter += 1

        filepath = self.create_filename()

        with open(filepath, 'w') as dump_file:
            json_msg = json.loads(json_body)
            json.dump(json_msg, dump_file)
            self.log.info("MQ message data dumped to file: {}".format(filepath))
