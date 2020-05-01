import logger

from SimulatorDataDump import SimulatorDataDump
from DataDumpFile import DataDumpFile


"""
ATTENTION:
You have to start the docker container rabbitmq, car-simulator and booking-simulator
in ./docker-compose.yml and ./docker-compose.simulators.yml before running this script!
"""


def simulator_dump(
        dump_folder,
        dump_filename,
        number_of_messages,
        mq_exchange_name,
        routing_key=None):
    log.info(f"Starting to dump data for {mq_exchange_name} simulator...")

    data_dump_file = DataDumpFile(dump_folder, dump_filename)
    data_dump = SimulatorDataDump(data_dump_file, mq_exchange_name, routing_key).init()
    data_dump.dump_to_json(number_of_messages)
    data_dump.close()


if __name__ == "__main__":
    log = logger.create("run_simulator_data_dumps")

    simulator_dump(
        dump_folder="./packages/route-evaluation/tmp",
        dump_filename="car_simulator_data.json",
        number_of_messages=3,
        mq_exchange_name="cars")

    simulator_dump(
        dump_folder="./packages/route-evaluation/tmp",
        dump_filename="bookings_simulator_data.json",
        number_of_messages=3,
        mq_exchange_name="bookings",
        routing_key="new")
