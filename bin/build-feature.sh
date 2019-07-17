#!/bin/bash


DOCKER_REPO="iteam1337/predictive-movement-${1/packages\//}";
DOCKER_TAG="feat/some-feature"
PROJECT=$1

echo "building $DOCKER_REPO:$DOCKER_TAG"
echo "TRAVIS_BRANCH is $TRAVIS_BRANCH"
echo "TRAVIS_PULL_REQUEST_BRANCH is $TRAVIS_PULL_REQUEST_BRANCH"

docker login -u "$DOCKER_USER" -p "$DOCKER_PASSWORD"

docker build -t $DOCKER_REPO:$DOCKER_TAG $PROJECT

docker push $DOCKER_REPO:$DOCKER_TAG

docker logout