PODS:               PodA                PodB
                      |                   |
WORKLOADS:          DeploymentA         DaemonSetB
                      |                   |
Cluster network:    Service      <->    Service
                      |                   |
                    Ingress             Ingress
                          \             /
the Internet:             Ingress controller