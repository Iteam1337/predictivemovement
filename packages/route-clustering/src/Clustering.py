import json
import numpy as np

from sklearn.cluster import KMeans

from FindElbow import FindElbow
from RequestData import RequestData


class Clustering:
    """
    This class clusters the JSON route optimization request defined by bookings
    and vehicles. It clusters the bookings and the vehicles are predicted/assigned
    to their nearest cluster. Very simple approach.
    """

    def __init__(self):
        self.request = None
        self.request_data = None
        self.model = None
        self.n_clusters = None
        self.find_elbow = None
        self.booking_clusters = None
        self.vehicle_clusters = None
        self.clustered_request = None
        self.vehicle_cluster_labels = None

    def init(self, request):
        self.request = request
        return self

    def run(self):
        self.prepare_data()
        self.find_k()
        self.fit()
        self.split_bookings_by_clusters()
        self.assign_vehicles_to_clusters()
        self.split_vehicles_by_clusters()

        self.create_clustered_request()

    def prepare_data(self):
        self.request_data = RequestData().init(self.request)
        self.request_data.bookings_to_points()
        self.request_data.vehicles_to_points()

    def find_k(self):
        self.find_elbow = FindElbow().init(self.request_data)
        self.find_elbow.run()
        self.n_clusters = self.find_elbow.elbow_k

    def fit(self):
        self.model = KMeans(n_clusters=self.n_clusters)
        self.model.fit(self.request_data.X)
        # print(self.model.labels_)
        # print(self.model.cluster_centers_)

    def split_bookings_by_clusters(self):
        self.booking_clusters = {}

        # initialize empty clusters arrays
        cluster_numbers = np.unique(self.model.labels_)
        for cluster_number in cluster_numbers:
            cluster_nr = f"{cluster_number}"
            self.booking_clusters[cluster_nr] = []

        # add bookings to cluster
        for index, cluster_number in enumerate(self.model.labels_):
            cluster_nr = f"{cluster_number}"
            booking = self.request_data.bookings_by_index[index]
            self.booking_clusters[cluster_nr].append(booking)

    def assign_vehicles_to_clusters(self):
        self.vehicle_cluster_labels = self.model.predict(self.request_data.V)
        # print(self.vehicle_cluster_labels)

    def split_vehicles_by_clusters(self):
        self.vehicle_clusters = {}

        # initialize empty clusters arrays
        cluster_numbers = np.unique(self.model.labels_)
        #cluster_numbers = np.unique(self.vehicle_cluster_labels)
        for cluster_number in cluster_numbers:
            cluster_nr = f"{cluster_number}"
            self.vehicle_clusters[cluster_nr] = []

        # add vehicles to cluster
        for index, cluster_number in enumerate(self.vehicle_cluster_labels):
            cluster_nr = f"{cluster_number}"

            vehicle = self.request_data.vehicles_by_index[index]
            self.vehicle_clusters[cluster_nr].append(vehicle)

    def create_clustered_request(self):
        self.clustered_request = []

        cluster_numbers = np.unique(self.model.labels_)
        for cluster_number in cluster_numbers:
            cluster_nr = f"{cluster_number}"

            metadata = {}
            metadata['cluster_nr'] = cluster_nr
            metadata['bookings'] = len(self.booking_clusters[cluster_nr])
            metadata['vehicles'] = len(self.vehicle_clusters[cluster_nr])
            metadata['centroid_lon_lat'] = f"{self.model.cluster_centers_[cluster_number, :]}"

            cluster_req = {}
            cluster_req['metadata'] = metadata
            cluster_req['vehicles'] = self.vehicle_clusters[cluster_nr]
            cluster_req['bookings'] = self.booking_clusters[cluster_nr]

            self.clustered_request.append(cluster_req)
