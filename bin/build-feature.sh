#!/usr/bin/env bash

set -e

DOCKER_REPO="iteam1337/predictive-movement-${1/packages\//}";
DOCKER_TAG=$(echo $TRAVIS_PULL_REQUEST_BRANCH | sed 's/\+/-/g; s/\//-/g; s/\=/-/g')
PROJECT=$1
echo "building $DOCKER_REPO:$DOCKER_TAG"

docker login -u "$DOCKER_USER" -p "$DOCKER_PASSWORD"

docker build -t $DOCKER_REPO:$DOCKER_TAG $PROJECT
docker push $DOCKER_REPO:$DOCKER_TAG

docker logout
