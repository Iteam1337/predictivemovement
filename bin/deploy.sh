#!/usr/bin/env bash

set -e

curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
mv ./kubectl /usr/local/bin/kubectl

DEPLOYMENT="${1/packages\//}"

echo "$DEPLOYMENT is being deployed"

kubectl --server=$KUBERNETES_SERVER --token=$KUBERNETES_TOKEN --insecure-skip-tls-verify=true rollout restart deployment/$DEPLOYMENT
