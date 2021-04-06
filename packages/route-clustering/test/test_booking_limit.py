import json

from BookingLimit import BookingLimit
from Clustering import Clustering
from ClusteringVisualization import ClusteringVisualization


def test_clustering_by_booking_limit():
    # given
    max_bookings_in_cluster = 30
    json_file = '/workspace/data/request/req_v34_b120.json'

    with open(json_file) as req_file:
        request = json.load(req_file)

    clustering = Clustering().init(request)
    clustering.run()

    # when
    booking_limit = BookingLimit().init(clustering.clustered_request,
                                        max_bookings_in_cluster)
    booking_limit.run()

    # then
    print("#########")
    for index, clustered_request in enumerate(booking_limit.clustered_request):
        print(f"{index}----------")
        print(clustered_request['metadata'])

    #visualization = ClusteringVisualization().init(booking_limit.clustering)
    # visualization.visualize_clusters()
    # visualization.write_to_json_file(filename="test/resources/clustered.json")


if __name__ == "__main__":
    test_clustering_by_booking_limit()
