from Clustering import Clustering


class BookingLimit:
    """
    This class clusters too large clusters iteratively until they have reached 
    the set booking size limit. This is a very simple approach and gives not 
    the best clustering results as a base for a route optimization!
    """

    def __init__(self):
        self.clustered_request = None
        self.max_bookings_in_cluster = None
        self.max_iterations = 10

    def init(self, clustered_request, max_bookings_in_cluster):
        self.clustered_request = clustered_request
        self.max_bookings_in_cluster = max_bookings_in_cluster
        return self

    def run(self):
        self._recluster_x_times()

    def _recluster_x_times(self):
        for iteration in range(self.max_iterations):
            print(f"re-cluster iteration {iteration} of {self.max_iterations}")

            was_reclustered = self.recluster()
            if not was_reclustered:
                print(f"no reclustering was needed")
                break

    def recluster(self):
        was_reclustered = False

        re_clustered_request = []

        for index, clustered_request in enumerate(self.clustered_request):
            # print(f"{index}----------")
            # print(clustered_request['metadata'])
            bookings_nr = clustered_request['metadata']['bookings']

            if (bookings_nr > self.max_bookings_in_cluster):
                was_reclustered = True
                print(f"need to re-cluster cluster {index} with {bookings_nr} "
                      f"bookings to reach limit {self.max_bookings_in_cluster}!")

                clustering = Clustering().init(clustered_request)
                clustering.run()

                for re_cluster in clustering.clustered_request:
                    # print(re_cluster['metadata'])
                    re_cluster['metadata']['cluster_nr'] = f"{index}-{re_cluster['metadata']['cluster_nr']}"
                    re_clustered_request.append(re_cluster)
            else:
                print(f"no need to re-cluster cluster {index} with {bookings_nr} "
                      f"bookings to reach limit {self.max_bookings_in_cluster}.")
                re_clustered_request.append(clustered_request)

        self.clustered_request = re_clustered_request

        return was_reclustered
