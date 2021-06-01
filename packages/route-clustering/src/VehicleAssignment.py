import numpy as np


class VehicleAssignment:
    """
    This class re-assigns vehicles from clusters to clusters which are not
    having the set min number of vehicles.
    """

    def __init__(self):
        self.min_vehicles_nr = 1
        self.vehicle_distances = None

    def init(self, clustered_request):
        self.clustered_request = clustered_request
        return self

    def run(self):
        re_clustered_request = []

        for index, clustered_request in enumerate(self.clustered_request):
            # print(f"{index}----------")
            # print(clustered_request['metadata'])
            vehicles_nr = clustered_request['metadata']['vehicles']

            if (vehicles_nr < self.min_vehicles_nr):
                print(f"need to re-assign vehciles for cluster {index} with {vehicles_nr} "
                      f"vehicles to reach min of {self.min_vehicles_nr}!")

                centroid_lon_lat = clustered_request['metadata']['centroid_lon_lat']
                self.calculate_vehicle_distances(centroid_lon_lat)

                # TODO this is not working! After reassign the clustered_request is changed!!
                self.reassign_vehicles(clustered_request)

            # else:
                # print(f"no need to re-assign vehciles for cluster {index} with {vehicles_nr} "
                #      f"bookings to reach limit {self.min_vehicles_nr}.")

        self.clustered_request = re_clustered_request

    def calculate_vehicle_distances(self, centroid_lon_lat):
        centroid_lon_lat = np.array(centroid_lon_lat)

        self.vehicle_distances = {}

        for index, clustered_request in enumerate(self.clustered_request):
            # print(f"{index}----------")

            for vehicle in clustered_request['vehicles']:

                for location in ['start_address', 'end_address']:
                    distance = self.calculate_vehicle_distance(vehicle,
                                                               location,
                                                               centroid_lon_lat)
                    self.vehicle_distances[distance] = {
                        "cluster": index,
                        "vehicle": vehicle
                    }

    def calculate_vehicle_distance(self, vehicle, location, centroid_lon_lat):
        vehicle_lon_lat = np.array([
            float(vehicle[location]['lon']),
            float(vehicle[location]['lat'])
        ])
        distance = centroid_lon_lat - vehicle_lon_lat
        distance = abs(distance[0]) + abs(distance[1])
        return distance

    def reassign_vehicles(self, clustered_request):
        # nearest = min(self.vehicle_distances.keys())
        # print(self.vehicle_distances[nearest])

        # print(self.vehicle_distances.keys())
        distance_by_nearest = sorted(self.vehicle_distances.keys())
        print(distance_by_nearest)

        for nearest in distance_by_nearest:
            # print(nearest)
            nearest_vehicle = self.vehicle_distances[nearest]
            print(nearest_vehicle)

            # TODO check if cluster has enough vehicles to move
            # if not go for next in list

            # TODO move json vehicle field to another cluster
