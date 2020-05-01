import logger

import SimulatorDataDump as SimulatorDataDump


"""
ATTENTION:
You have to start the docker container rabbitmq, car-simulator and booking-simulator
in ./docker-compose.yml and ./docker-compose.simulators.yml before running this script!
"""


if __name__ == "__main__":
    log = logger.create("run_simulator_data_dumps")

    log.info(f"Starting to dump data for cars simulator...")
    SimulatorDataDump.simulator_dump(
        dump_folder="./packages/route-evaluation/tmp",
        dump_filename="car_simulator_data.json",
        number_of_messages=3,
        mq_exchange_name="cars",
        mq_exchange_type="fanout")

    log.info(f"Starting to dump data for bookings simulator...")
    SimulatorDataDump.simulator_dump(
        dump_folder="./packages/route-evaluation/tmp",
        dump_filename="bookings_simulator_data.json",
        number_of_messages=3,
        mq_exchange_name="bookings",
        mq_exchange_type="topic",
        routing_key="new")
