from sklearn.cluster import KMeans
from kneed.knee_locator import KneeLocator


class FindElbow:
    """
    This class uses the elbow method to find a number for k, the number of 
    clusters to build.
    """

    def __init__(self):
        self.distortions = []
        self.max_ks = None
        self.k_range = None
        self.elbow_k = None
        self.request_data = None

    def init(self, request_data, max_ks=20):
        self.request_data = request_data
        self.max_ks = max_ks
        return self

    def run(self):
        self.k_range = range(1, self.max_ks)

        self.cluster_for_distortions()
        self.find_elbow_k()

    def cluster_for_distortions(self):
        for k in self.k_range:
            kmeans = KMeans(n_clusters=k)
            kmeans.fit(self.request_data.X)

            self.distortions.append(kmeans.inertia_)
            #print(f"{k}: {kmeans.inertia_}")

    def find_elbow_k(self):
        kneedle = KneeLocator(self.k_range,
                              self.distortions,
                              S=1.0,
                              curve="convex",
                              direction="decreasing")
        self.elbow_k = int(kneedle.knee)
        # print(kneedle.knee)
