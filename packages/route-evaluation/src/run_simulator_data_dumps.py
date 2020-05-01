import logger

from SimulatorDataDump import SimulatorDataDump
from DataDumpFile import DataDumpFile


"""
ATTENTION:
You have to start the docker container rabbitmq, car-simulator and booking-simulator
in ./docker-compose.dev.yml before running this script!
"""


def simulator_dump(
        dump_folder,
        dump_filename,
        mq_exchange_name,
        number_of_messages):
    log.info("Starting to dump data for {} simulator...".format(mq_exchange_name))

    data_dump_file = DataDumpFile(dump_folder, dump_filename)
    data_dump = SimulatorDataDump(mq_exchange_name, data_dump_file).init()
    data_dump.dump_to_json(number_of_messages)
    data_dump.close()


if __name__ == "__main__":
    log = logger.create("run_simulator_data_dumps")

    simulator_dump(
        dump_folder="./packages/route-evaluation/tmp",
        dump_filename="car_simulator_data.json",
        mq_exchange_name="cars",
        number_of_messages=3)

    simulator_dump(
        dump_folder="./packages/route-evaluation/tmp",
        dump_filename="bookings_simulator_data.json",
        mq_exchange_name="bookings",
        number_of_messages=3)
