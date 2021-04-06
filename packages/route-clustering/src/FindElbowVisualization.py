import matplotlib.pyplot as plt

from FindElbow import FindElbow


class FindElbowVisualization:
    """
    This class visualizes 'the elbow'.
    """

    def __init__(self):
        self.find_elbow = None

    def init(self, find_elbow: FindElbow):
        self.find_elbow = find_elbow
        return self

    def plot_elbow(self, filename='tmp/elbow_k.png'):
        plt.figure(figsize=(16, 8))
        plt.plot(self.find_elbow.k_range, self.find_elbow.distortions, 'bx-')
        plt.xlabel('k')
        plt.ylabel('Distortion')
        plt.title('The Elbow Method showing the optimal k')
        plt.savefig(filename)
        plt.close()
