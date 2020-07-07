FROM pelias/csv-importer

COPY paketdata2019.csv /data/paketdata2019.csv
COPY pelias.json /code/pelias.json
# COPY placeholder /code/pelias/csv-importer/data/placeholder


# csv-importer:
# image: pelias/csv-importer:master
# container_name: pelias_csv_importer
# user: "${DOCKER_USER}"
# volumes:
# - "./pelias.json:/code/pelias.json"
# - "${DATA_DIR}:/data"
# - "./blacklist/:/data/blacklist"

# FROM ubuntu:20.04
# RUN apt update
# RUN apt install -y git
# RUN apt install -y docker-compose

# # RUN git clone https://github.com/pelias/docker.git && cd docker && ln -s "$(pwd)/pelias" /usr/local/bin/pelias
# RUN git clone https://github.com/pelias/csv-importer && cd csv-importer
# RUN 

# RUN mkdir /docker/projects/ljusdal
# COPY paketdata2019.csv /docker/projects/ljusdal/paketdata2019.csv
# RUN mkdir /docker/projects/ljusdal/data
# RUN echo 'DATA_DIR=./data' >> /docker/projects/ljusdal/.env
# ENV PELIAS_CONFIG=/code/pelias/csv-importer/pelias.json
CMD sleep 200000