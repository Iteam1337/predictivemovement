import logger

import SimulatorDataDump as SimulatorDataDump


"""
ATTENTION:
You have to start the docker container rabbitmq and engine in ./docker-compose.yml and
in ./docker-compose.engine.yml.
After that you have to start this script and then the car-simulator and booking-simulator
in ./docker-compose.simulators.yml!
"""


if __name__ == "__main__":
    log = logger.create("run_candidates_result_dump")

    log.info(f"Starting to dump data for candidates results...")
    SimulatorDataDump.simulator_dump(
        dump_folder="./packages/route-evaluation/tmp",
        dump_filename="candidates_result.json",
        number_of_messages=1,
        mq_exchange_name="candidates",
        mq_exchange_type="fanout")
