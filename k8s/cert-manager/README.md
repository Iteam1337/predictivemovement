# cert-manager setup

## Requirements before you start

- Have `kubectl` [installed](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

- Access to Iteam organization in [Containership](https://containership.io)

- Acess to Iteam AWS

### Install it

- Following their [instructions](https://docs.cert-manager.io/en/latest/getting-started/install/kubernetes.html)

```bash
kubectl create namespace cert-manager
```

```bash
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true
```

```bash
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.9.0/cert-manager.yaml
```

- Since we run `cert-manager` in it's own namespace we will need access to AWS credentials used for Let's Encrypt DNS challenge.

  One way of solving this is by copying the credentials from `kube-system` namespace (you have this since you've used Containership for creating the cluster) to `cert-manager` (or you can create a new secret)

```bash
kubectl get secret amazon-web-service-credentials -n kube-system -o yaml | \
    sed "s/namespace: kube-system/namespace: cert-manager/" | \
    kubectl apply -n cert-manager -f -
```

### Creating our first Certificate and Issuer

- First get your AWS_ACCESS_KEY_ID from the AWS secret and base64 decode it and then update one of the yaml files provided (if this command does not work - I don't know bash :) )

```bash
  kubectl get secret amazon-web-service-credentials -n cert-manager -o yaml | \
    grep AWS_ACCESS_KEY_ID | \
    head -1 | \
    sed "s/AWS_ACCESS_KEY_ID://" | \
    awk '{$1=$1};1' | \
    base64 -D
```

- This setup uses a `ClusterIssuer` versus multiple `Issuer`s. An `Issuer` is a namespaced resource so if you have multiple namespaces (say a namespace per project) you will have to create one `Issuer` in every of them.
A `CluserIssuer` however can issue certificates for `Certificate` resources in all namespaces

- Have a look at `dnsNames` and `domains` in the `Certificate` resource in the `certificate.yaml` file.
Also check the `secretName: letsencrypt-prod`. That is the name of the secret containing the certificate that you will use later in the `Ingress` configuration

- Update the `accessKeyID` under the `ClusterIssuer` resource (if needed and if you work on a new cluster otherwise just ignore this)

- Deploy the `ClusterIssuer` and `Certificate`

```bash
kubectl apply -f issuer.yaml
```

```bash
kubectl apply -f certificate.yaml
```

The configuration for using https in the Ingress is:

```yaml
tls:
  - hosts:
    - map.pm.iteamdev.se
    secretName: letsencrypt-prod
```
