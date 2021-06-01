import json

from Clustering import Clustering
from ClusteringVisualization import ClusteringVisualization


def test_clustered_request_visualization():
    # given
    json_file = 'test/resources/clustered_request.json'

    with open(json_file) as req_file:
        clustered_request = json.load(req_file)

    # when
    clustering_visualization = ClusteringVisualization().init(clustered_request)
    clustering_visualization.visualize_clusters(
        filename='tmp/visualization_clustered_request_test.png')

    # then
    # TODO assert


def test_booking_limit_clustered_request_visualization():
    # given
    json_file = 'test/resources/booking_limit_clustered.json'

    with open(json_file) as req_file:
        clustered_request = json.load(req_file)

    # when
    clustering_visualization = ClusteringVisualization().init(clustered_request)
    clustering_visualization.visualize_clusters(
        filename='tmp/visualization_booking_limit_clustered_request_test.png')

    # then
    # TODO assert


if __name__ == "__main__":
    test_clustered_request_visualization()
    test_booking_limit_clustered_request_visualization()
