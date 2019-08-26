## Requirements before you start

- Have `kubectl` [installed](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

- Have `helm` [installed](https://helm.sh/docs/using_helm/#installing-helm) (We use helm charts for templates that we render and then deploy using kubectl)

- Access to Iteam organization in [Containership](https://containership.io)

- Acess to Iteam AWS if you create a cluster in AWS (as we did)

## Setup a Kubernetes cluster with Containership

- [Add Amazon Web Services as a provider](https://docs.containership.io/en/articles/504594-how-to-add-amazon-web-services-as-a-provider) (This has already been configured)

- [Launch cluster using AWS](https://docs.containership.io/en/articles/2241901-launch-cluster-using-amazon-web-services-aws)

## Connecting to the cluster

#### Easy option but slow speed when running commands since it goes through a Containership proxy

- Copy your `kubectl connection info` from the cluster's overview page in Containership

#### More complicated option but faster speed since you are connecting directly to the cluster

- [Add your ssh key with Containership](https://docs.containership.io/en/articles/1523970-managing-ssh-keys)

- Inside AWS Instances find your master node or one of them if you have a pool of them and get your public IP

- SSH into it using the user `containership`

- Look for the `kube-admin` configuration (if it's not there you're probably on a worker node)

```bash
sudo su
cat /etc/kubernetes/admin.conf
```

- Copy the `client-certificate-data` and `client-key-data` from the `user` under the `users` section (we will use them in the next step)

- Now edit your local `kubectl configuration` usually located in `~/.kube/config` and add the following to the according sections

`clusters:`

```yaml
- cluster:
    insecure-skip-tls-verify: true
    server: https://<public IP or dns name of master node>:6443
  name: aws
```

`contexts:`

```yaml
- context:
    cluster: aws
    user: kubernetes-admin-aws
  name: kubernetes-admin-aws@aws
```

`users:`

```yaml
- name: kubernetes-admin-aws
  user:
    client-certificate-data: <The one you copied from the server>
    client-key-data: <The one you copied from the server>
```

- Change the context to the newly created one

```bash
kubectl config use-context kubernetes-admin-aws@aws
```

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

Also set `KUBERNETES_SERVER` as `https://<PUBLIC IP OF THE AWS MASTER NODE>:6443`
