import numpy as np


class RequestData:
    """
    This class keeps the vehicle, pickup and delivery points to cluster.

    Each vehicle or booking has two points (start/end and pickup/delivery). For
    simplicity, the mean of the two points is used for clustering.
    """

    def __init__(self):
        self.request = None
        self.X = None
        self.V = None
        self.bookings_by_index = None
        self.vehicles_by_index = None

    def init(self, request):
        self.request = request
        return self

    def bookings_to_points(self):
        self.bookings_by_index = []
        bookings_mean = []

        for booking in self.request['bookings']:
            # mean of lon
            pickup_lon = booking['pickup']['lon']
            delivery_lon = booking['delivery']['lon']
            lon = np.mean([pickup_lon, delivery_lon])
            # print(lon)

            # mean of lat
            pickup_lat = booking['pickup']['lat']
            delivery_lat = booking['delivery']['lat']
            lat = np.mean([pickup_lat, delivery_lat])
            # print(lat)

            self.bookings_by_index.append(booking)
            bookings_mean.append([lon, lat])

        self.X = np.array(bookings_mean)

    def vehicles_to_points(self):
        self.vehicles_by_index = []
        vehicles_mean = []

        for vehicle in self.request['vehicles']:
            # mean of lon
            pickup_lon = vehicle['start_address']['lon']
            delivery_lon = vehicle['end_address']['lon']
            lon = np.mean([pickup_lon, delivery_lon])
            # print(lon)

            # mean of lat
            pickup_lat = vehicle['start_address']['lat']
            delivery_lat = vehicle['end_address']['lat']
            lat = np.mean([pickup_lat, delivery_lat])
            # print(lat)

            self.vehicles_by_index.append(vehicle)
            vehicles_mean.append([lon, lat])

        self.V = np.array(vehicles_mean)
