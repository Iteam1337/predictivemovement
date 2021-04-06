import json
import numpy as np
import matplotlib.pyplot as plt

from Clustering import Clustering


class ClusteringVisualization:
    """
    This class provides functions to visualize the clustering.
    """

    def __init__(self):
        self.clustering = None

    def init(self, clustering: Clustering):
        self.clustering = clustering
        return self

    def write_to_json_file(self, filename="tmp/request_clusters.json"):
        with open(filename, 'w', encoding='utf-8') as outfile:
            json.dump(self.clustering.clustered_request,
                      outfile,
                      ensure_ascii=False,
                      indent=4)

    def visualize_clusters(self, filename='tmp/clusters.png'):

        # TODO visualize by the json, not the model cause many models may have used

        # plot bookings
        plt.scatter(
            self.clustering.request_data.X[:, 0],
            self.clustering.request_data.X[:, 1],
            c=self.clustering.model.labels_,
            marker='.',
            s=10)

        # plot bookings centroids
        labels = np.unique(self.clustering.model.labels_)
        plt.scatter(self.clustering.model.cluster_centers_[:, 0],
                    self.clustering.model.cluster_centers_[:, 1],
                    c=labels,
                    s=50)

        # plot vehicles
        plt.scatter(
            self.clustering.request_data.V[:, 0],
            self.clustering.request_data.V[:, 1],
            c=self.clustering.vehicle_cluster_labels,
            marker='v',
            s=10)

        plt.title("K-Means")
        plt.xlabel("lon")
        plt.ylabel("lat")
        plt.savefig(filename)
