## Requirements before you start

- Have `kubectl` [installed](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

- Access to Iteam organization in [Containership](https://containership.io)

- Acess to Iteam AWS if you create a cluster in AWS (as we did)

## Setup a Kubernetes cluster with Containership

- [Add Amazon Web Services as a provider](https://docs.containership.io/en/articles/504594-how-to-add-amazon-web-services-as-a-provider) (This has already been configured)

- [Launch cluster using AWS](https://docs.containership.io/en/articles/2241901-launch-cluster-using-amazon-web-services-aws)

- Copy your `kubectl connection info` from the cluster's overview page

### Containership and AWS specific configuration once you have a cluster

This only applies if you have used AWS. <br>
At the time of writing this there seems to be an issue with volume creation with the [`aws-ebs-driver`](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) that Containership uses. <br>

So go ahead and apply a newer configuration that seems to work (either by following the above github instructions) or by simply running:

```bash
kubectl apply -f containership-aws/aws-ebs-driver.yaml
```

You need to also create [AWS specific StorageClasses](https://kubernetes.io/docs/concepts/storage/storage-classes/#aws-ebs) that are probably not included with your cluster and are being used in osrm.yaml, redis.yaml, traefik.yaml

```bash
kubectl apply -f containership-aws/gp2-storageclass.yaml
kubectl apply -f containership-aws/io1-storageclass.yaml
```

## Traefik

We use Traefik as an [Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/).

All the resources needed and the configuration for it are in `traefik.yaml`.

#### Deploy it

```bash
kubectl apply -f traefik.yaml
```

You can check [Traefik docs](https://docs.traefik.io/) and make changes to the config based on your needs. When applying config changes (aka making changes to the `ConfigMap` object) you want to delete the current pod(s) so that the new one(s) created pick up the changes.

```bash
kubectl -n kube-system delete pod $(kubectl -n kube-system get pod -l app=traefik -o jsonpath='{.items[0].metadata.name}')
```

## Rest of the stack

Apply the rest of the stack components (osrm, redis, map and match-route)

```bash
kubectl apply -f osrm.yaml
kubectl apply -f redis.yaml
kubectl apply -f map.yaml
kubectl apply -f match-route.yaml
```

## Route53 setup

Create record sets for the hosts that you defined in the `Ingress` resources for `map` and `match-route` and point them to the worker node(s) IP (already configured for map.iteamdev.se and match-route.iteamdev.se)

## I don't wanna read just give me TL;DR version

- create a cluster with Containership using AWS as the provider
- `kubectl apply -f k8s`