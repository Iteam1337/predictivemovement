import json

from Clustering import Clustering
from ClusteringVisualization import ClusteringVisualization
from FindElbowVisualization import FindElbowVisualization


def test_foo():
    # given
    #json_file = 'data/request/10_route_request.json'
    json_file = '/workspace/data/request/req_v34_b120.json'

    with open(json_file) as req_file:
        request = json.load(req_file)

    # when
    clustering = Clustering().init(request)
    clustering.run()

    # then
    clustering_visualization = ClusteringVisualization().init(clustering)
    clustering_visualization.visualize_clusters()
    clustering_visualization.write_to_json_file()

    find_elbow_visualization = FindElbowVisualization().init(clustering.find_elbow)
    find_elbow_visualization.plot_elbow()


if __name__ == "__main__":
    test_foo()
