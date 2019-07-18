#!/bin/bash

curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
mv ./kubectl /usr/local/bin/kubectl

curl -LO https://git.io/get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh

FEATURE=$(echo $TRAVIS_PULL_REQUEST_BRANCH | sed 's/\+/-/g; s/\//-/g; s/\=/-/g')
DEPLOYMENT="${1/packages\//}"
KUBECTL_ARGS=( --server=$KUBERNETES_SERVER --token=$KUBERNETES_TOKEN --insecure-skip-tls-verify=true )

echo "$DEPLOYMENT is being deployed"

helm template k8s/charts/$DEPLOYMENT --name $DEPLOYMENT --namespace $FEATURE \
  --set ingress.hosts[0].host=$DEPLOYMENT-$FEATURE.pm.iteamdev.se \
  --set image.tag=$FEATURE | \
kubectl "${KUBECTL_ARGS[@]}" apply -f -

### Copy google and mapbox secrets from default namespace into the new namespace
if ! (kubectl "${KUBECTL_ARGS[@]}" -n $FEATURE get secret google-token)
then
  kubectl "${KUBECTL_ARGS[@]}" get secret google-token -n default -o yaml | \
    sed "s/namespace: default/namespace: $FEATURE/" | \
    kubectl "${KUBECTL_ARGS[@]}" apply -n $FEATURE -f -
fi

if ! (kubectl "${KUBECTL_ARGS[@]}" -n $FEATURE get secret mapbox-token)
then
  kubectl "${KUBECTL_ARGS[@]}" get secret mapbox-token -n default -o yaml | \
    sed "s/namespace: default/namespace: $FEATURE/" | \
    kubectl "${KUBECTL_ARGS[@]}" apply -n $FEATURE -f -
fi

### Post a comment to Github PR when there isn't a pod yet for the new feature (prevents from posting on every commit)
if ! (kubectl "${KUBECTL_ARGS[@]}" -n $FEATURE get pod -l app.kubernetes.io/name=$DEPLOYMENT -o jsonpath='{.items[0].metadata.name}');
then
  curl -H "Authorization: token ${GITHUB_TOKEN}" -X POST \
  -d "{\"body\": \"Deployment preview ready at: https://$DEPLOYMENT-$FEATURE.pm.iteamdev.se\"}" \
  "https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments";
fi
