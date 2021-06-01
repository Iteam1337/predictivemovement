import json

from Clustering import Clustering
from ClusteringVisualization import ClusteringVisualization
from FindElbowVisualization import FindElbowVisualization


def test_clustering_of_large_booking_request():
    # given
    json_file = 'test/resources/large_bookings_request.json'

    with open(json_file) as req_file:
        request = json.load(req_file)

    # when
    # TODO do not randomize for test assert
    clustering = Clustering().init(request)
    clustering.run()

    # then
    clustering_visualization = ClusteringVisualization().init(
        clustering.clustered_request)
    clustering_visualization.visualize_clusters(
        filename='tmp/clustering_visualization_test.png')
    clustering_visualization.write_to_json_file(
        filename='tmp/clustering_test.json'
    )

    find_elbow_visualization = FindElbowVisualization().init(clustering.find_elbow)
    find_elbow_visualization.plot_elbow(
        filename='tmp/clustering_elbow_k_test.png')

    # TODO assert


if __name__ == "__main__":
    test_clustering_of_large_booking_request()
