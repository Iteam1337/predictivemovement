import json

from BookingLimit import BookingLimit
from ClusteringVisualization import ClusteringVisualization


def test_clustering_by_booking_limit():
    # given
    max_bookings_in_cluster = 30
    json_file = 'test/resources/large_cluster_in_clustered_request.json'

    with open(json_file) as req_file:
        clustered_request = json.load(req_file)

    # when
    booking_limit = BookingLimit().init(clustered_request,
                                        max_bookings_in_cluster)
    booking_limit.run()

    # then
    # print("#########")
    # for index, clustered_request in enumerate(booking_limit.clustered_request):
    #    print(f"{index}----------")
    #    print(clustered_request['metadata'])

    visualization = ClusteringVisualization().init(booking_limit.clustered_request)
    visualization.write_to_json_file(
        filename="tmp/booking_limit_clustered_test.json")
    visualization.visualize_clusters(
        filename="tmp/booking_limit_clustered_test.png")

    # TODO assert


if __name__ == "__main__":
    test_clustering_by_booking_limit()
