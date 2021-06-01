import json
import numpy as np
import matplotlib.pyplot as plt

from RequestData import RequestData


class ClusteringVisualization:
    """
    This class provides functions to visualize the clustering.
    """

    def __init__(self):
        self.clustered_request = None

    def init(self, clustered_request):
        self.clustered_request = clustered_request
        return self

    def write_to_json_file(self, filename="tmp/request_clusters.json"):
        with open(filename, 'w', encoding='utf-8') as outfile:
            json.dump(self.clustered_request,
                      outfile,
                      ensure_ascii=False,
                      indent=4)

    def visualize_clusters(self, filename='tmp/clusters.png'):
        # TODO better color separation

        vehicles = None
        vehicles_labels = None

        bookings = None
        bookings_labels = None

        centroids = []
        centroids_labels = []

        for index, cluster in enumerate(self.clustered_request):
            #print(f'{index}: {cluster["metadata"]["cluster_nr"]}')

            request_data = RequestData().init(cluster)

            # vehicles
            # print(vehicles)
            # print(request_data.V)
            request_data.vehicles_to_points()
            if vehicles is None:
                if len(request_data.V) != 0:
                    vehicles = request_data.V
            else:
                if len(request_data.V) != 0:
                    vehicles = np.concatenate((vehicles,
                                               request_data.V),
                                              axis=0)

            cluster_vehicle_labels = np.full(shape=len(request_data.V),
                                             fill_value=index,
                                             dtype=np.int)
            if vehicles_labels is None:
                vehicles_labels = cluster_vehicle_labels
            else:
                vehicles_labels = np.concatenate((vehicles_labels,
                                                  cluster_vehicle_labels),
                                                 axis=0)

            # bookings
            request_data.bookings_to_points()
            if bookings is None:
                bookings = request_data.X
            else:
                bookings = np.concatenate((bookings, request_data.X), axis=0)

            cluster_bookings_labels = np.full(shape=len(request_data.X),
                                              fill_value=index,
                                              dtype=np.int)
            if bookings_labels is None:
                bookings_labels = cluster_bookings_labels
            else:
                bookings_labels = np.concatenate((bookings_labels,
                                                  cluster_bookings_labels),
                                                 axis=0)

            # centroids
            centroid_lon_lat = cluster["metadata"]["centroid_lon_lat"]
            centroids.append(centroid_lon_lat)

            centroids_labels.append(index)

        centroids = np.asarray(centroids)

        # plot bookings
        # print(bookings_labels)
        # print(bookings)
        plt.scatter(
            bookings[:, 0],
            bookings[:, 1],
            c=bookings_labels,
            marker='.',
            s=10)

        # plot centroids
        # print(centroids_labels)
        # print(centroids)
        plt.scatter(centroids[:, 0],
                    centroids[:, 1],
                    c=centroids_labels,
                    s=50)

        # plot vehicles
        # print(vehicles_labels)
        # print(vehicles)
        plt.scatter(
            vehicles[:, 0],
            vehicles[:, 1],
            c=vehicles_labels,
            marker='v',
            s=10)

        plt.title("K-Means")
        plt.xlabel("lon")
        plt.ylabel("lat")
        plt.savefig(filename)
