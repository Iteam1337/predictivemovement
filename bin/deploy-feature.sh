#!/bin/bash

curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
mv ./kubectl /usr/local/bin/kubectl

curl -LO https://git.io/get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh

FEATURE=$(echo $TRAVIS_PULL_REQUEST_BRANCH | sed 's/\+/-/g; s/\//_/g; s/\=//g')
DEPLOYMENT="${1/packages\//}"

echo "$DEPLOYMENT is being deployed"

helm template k8s/charts/$DEPLOYMENT --name $DEPLOYMENT --namespace $FEATURE \
  --set ingress.hosts[0].host=$DEPLOYMENT-$FEATURE.pm.iteamdev.se \
  --set image.tag=$FEATURE | \
kubectl --server=$KUBERNETES_SERVER --token=$KUBERNETES_TOKEN --insecure-skip-tls-verify=true apply -f -

kubectl --server=$KUBERNETES_SERVER --token=$KUBERNETES_TOKEN --insecure-skip-tls-verify=true get secret google-token -n default -o yaml | \
  sed 's/namespace: default/namespace: $FEATURE/' | \
  kubectl --server=$KUBERNETES_SERVER --token=$KUBERNETES_TOKEN --insecure-skip-tls-verify=true apply -f -

kubectl --server=$KUBERNETES_SERVER --token=$KUBERNETES_TOKEN --insecure-skip-tls-verify=true get secret mapbox-token -n default -o yaml | \
  sed 's/namespace: default/namespace: $FEATURE/' | \
  kubectl --server=$KUBERNETES_SERVER --token=$KUBERNETES_TOKEN --insecure-skip-tls-verify=true apply -f -