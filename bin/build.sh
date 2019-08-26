#!/usr/bin/env bash

set -e

DOCKER_REPO="iteam1337/predictive-movement-${1/packages\//}";
DOCKER_TAG="latest"
PROJECT=$1

echo "building $DOCKER_REPO:$DOCKER_TAG"

docker login -u "$DOCKER_USER" -p "$DOCKER_PASSWORD"

docker build -t $DOCKER_REPO:$DOCKER_TAG --build-arg "GOOGLE_API_TOKEN=$GOOGLE_API_TOKEN" \
--build-arg "MAPBOX_TOKEN=$MAPBOX_TOKEN" \
--build-arg "API_HOST=$API_HOST" $PROJECT

docker push $DOCKER_REPO:$DOCKER_TAG

docker logout
