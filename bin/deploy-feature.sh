#!/bin/bash

curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
mv ./kubectl /usr/local/bin/kubectl

curl -LO https://git.io/get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh

helm

DEPLOYMENT="${1/packages\//}"

echo "$DEPLOYMENT is being deployed"

# kubectl --server=$KUBERNETES_SERVER --token=$KUBERNETES_TOKEN --insecure-skip-tls-verify=true rollout restart deployment/$DEPLOYMENT