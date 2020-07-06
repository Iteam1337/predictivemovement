#!/bin/bash
set -x

# change directory to the where you would like to install Pelias
# cd /path/to/install

# clone this repository
git clone https://github.com/pelias/docker.git && cd docker

# install pelias script
ln -s "$(pwd)/pelias" /usr/local/bin/pelias

# cd into the project directory
cd projects/portland-metro
echo $(pwd)
echo $(pwd)
echo $(pwd)
# create a directory to store Pelias data files
# see: https://github.com/pelias/docker#variable-data_dir
# note: use 'gsed' instead of 'sed' on a Mac
mkdir ./data
sed -i '/DATA_DIR/d' .env
echo 'DATA_DIR=./data' >> .env

# configure docker to write files as your local user
# see: https://github.com/pelias/docker#variable-docker_user
# note: use 'gsed' instead of 'sed' on a Mac
sed -i '/DOCKER_USER/d' .env
echo "DOCKER_USER=$(id -u)" >> .env

# run build
pelias compose pull
pelias elastic start
pelias elastic wait
pelias elastic create
pelias download all
pelias prepare all
pelias import all
pelias compose up

# optionally run tests
pelias test run