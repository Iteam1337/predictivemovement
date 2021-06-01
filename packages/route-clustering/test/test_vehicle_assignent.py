import json

from VehicleAssignment import VehicleAssignment
from ClusteringVisualization import ClusteringVisualization


def test_vehicle_assignment():
    # given
    json_file = 'test/resources/missing_vehicles_clustered_request.json'

    with open(json_file) as req_file:
        request = json.load(req_file)

    # when
    vehicle_assignment = VehicleAssignment().init(request)
    vehicle_assignment.run()

    # then
    visualization = ClusteringVisualization().init(
        vehicle_assignment.clustered_request)
    visualization.write_to_json_file(filename="tmp/vehicles_assigned.json")
    visualization.visualize_clusters(
        filename='tmp/vehicle_assignment_visualization_test.png')

    # TODO assert


if __name__ == "__main__":
    test_vehicle_assignment()
