import os
import pytest
import requests

from requests.exceptions import ConnectionError
from SimulatorDataDump import SimulatorDataDump


@pytest.fixture(scope="session")
def docker_compose_file(pytestconfig):
    return os.path.join(str(pytestconfig.rootdir), "", "docker-compose.yml")


def is_responsive(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return True
    except ConnectionError:
        return False


@pytest.fixture(scope="session")
def rabbitmq_service(docker_ip, docker_services):
    """
    Ensure that HTTP service is up and responsive.
    """
    port = docker_services.port_for("rabbitmq", 15672)
    url = "http://{}:{}".format(docker_ip, port)
    docker_services.wait_until_responsive(
        timeout=30.0, pause=0.1, check=lambda: is_responsive(url)
    )
    return url


def test_rabbit_mq_connection_can_be_established(rabbitmq_service):
    # given
    data_dump = SimulatorDataDump("None", None)

    # when
    data_dump._connect()

    # then
    assert data_dump.connection.is_open == True, "Connection to rabbit MQ is not open!"
