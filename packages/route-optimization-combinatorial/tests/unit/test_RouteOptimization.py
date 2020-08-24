from test_utils import read_json_file
from utils.Setting import Setting
from combinatorial.RouteOptimization import RouteOptimization


def test_request_01():
    # given
    setting = Setting().init("./resources/setting.json")
    route_request = read_json_file("/workspace/tests/resources"
                                   "/msg/01/01_route_request.json")
    route_optimization = RouteOptimization().init(setting)

    # when
    route_solutions = route_optimization.calculate(route_request)

    # then
    expected = read_json_file("/workspace/tests/resources"
                              "/msg/01/01_route_response.json")
    # print(route_solutions)
    # print(str(expected))
    assert str(expected) == str(route_solutions)


if __name__ == "__main__":
    test_request_01()
