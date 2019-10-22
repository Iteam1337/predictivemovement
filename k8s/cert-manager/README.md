# cert-manager setup

## Requirements before you start

- Have `kubectl` [installed](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

### Install it

- Following their [instructions](https://docs.cert-manager.io/en/latest/getting-started/install/kubernetes.html)

```bash
kubectl create namespace cert-manager
```

```bash
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.9.0/cert-manager.yaml
```

### Creating our first Certificate and Issuer

- We use `http01 challenge` since the domain is managed in AWS and we cannot create a `dns01 challenge` from Digital Ocean

- This setup uses a `ClusterIssuer` versus multiple `Issuer`s. An `Issuer` is a namespaced resource so if you have multiple namespaces (say a namespace per project) you will have to create one `Issuer` in every of them.
A `CluserIssuer` however can issue certificates for `Certificate` resources in all namespaces

- Have a look at `dnsNames` and `domains` in the `Certificate` resource in the `certificate.yaml` file.
Also check the `secretName: map-letsencrypt-prod`. That is the name of the secret containing the certificate that you will use later in the `Ingress` configuration

- Deploy the `ClusterIssuer` and `Certificate` resources

```bash
kubectl apply -f issuer.yaml
```

```bash
kubectl apply -f map-certificate.yaml
kubectl apply -f match-route-certificate.yaml
```

The configuration for using https in the Ingress is:

```yaml
tls:
  - hosts:
    - map.pm.iteamdev.se
    secretName: map-letsencrypt-prod
```
