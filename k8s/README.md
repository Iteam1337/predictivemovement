## Requirements before you start

- Have `kubectl` [installed](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

- Have `helm` [installed](https://helm.sh/docs/using_helm/#installing-helm) (We use helm charts for templates that we render and then deploy using kubectl)

- Have `doctl` [installed](https://github.com/digitalocean/doctl#installing-doctl) (Nice to have to be able to update your kube config to access the cluster)

- Acess to Iteam AWS

- Acess to Iteam Digital Ocean

## Setup a Kubernetes cluster in Digital Ocean

- This has already been created and available [here](https://cloud.digitalocean.com/kubernetes/clusters/6cc375a8-8092-4ebb-968f-55d88a7f5e04)

- Otherwise if you want to setup a cluster it's super [easy process](https://cloud.digitalocean.com/kubernetes/clusters/new)

- [Create a firewall](https://cloud.digitalocean.com/networking/firewalls/new) and configure the rules you want (allow HTTPS for example) on this instead of the one that Digital Ocean created for you -> [see this issue](https://www.digitalocean.com/community/questions/why-do-my-inbound-rules-keep-resetting)

- Created a Floating IP and then pointed in AWS Route53 the recordset `*.pm.iteamdev.se` to this IP

## Connecting to the cluster

- [Create a Personal access token](https://cloud.digitalocean.com/account/api/tokens)

- `doctl auth init` to initiate the login to Digital Ocean using your token created above

- `doctl k cluster kubeconfig save predictive-movement` to save your cluster configuration in your local kube config

## Traefik

We use Traefik as an [Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/).

All the resources needed and the configuration for it are in `traefik` folder.

## cert-manager

We use cert-manager for managing Let's Encrypt certificate retrieval.

All the resources needed and the configuration for it are in `cert-manager` folder.

## Create secrets for google and mapbox

We need secrets for Google and Mapbox api

```bash
kubectl create secret generic google-token --from-literal=GOOGLE_API_TOKEN=<TOKEN GOES HERE>
kubectl create secret generic mapbox-token --from-literal=MAPBOX_TOKEN=<TOKEN GOES HERE>
```

## Install Traefik and cert-manager and then the rest of the stack

Apply the rest of the stack components (osrm, redis, map and match-route)

Notice we also use `helm`. That is because setup feature deployments so we created charts for `map` and `match-route` that can easily be deployed with different values.

```bash
kubectl apply -f osrm.yaml
kubectl apply -f redis.yaml

## Generate helm template from the respective charts(directories) and pipe the output to kubectl apply.
helm template map --name map | kubectl apply -f -
helm template match-route --name match-route | kubectl apply -f -
```

## Travis setup

Create a different namespace and service account for Travis that we will use in Travis for deploying

```bash
kubectl apply -f travis-rbac.yaml
```

Get the token that was created for it

```bash
kubectl get secrets -n serviceids
kubectl get secret travis-token-<YOU GET THIS FROM ABOVE COMMAND> -n serviceids -o yaml
```

Take the `token` value from the secret, base64 decode it and head to Travis and store it as a secret environment variable as `KUBERNETES_TOKEN`

Also set `KUBERNETES_SERVER` variable from your kube config (`cat ~/.kube/config` and look for the `server:` value specific to this cluster)
