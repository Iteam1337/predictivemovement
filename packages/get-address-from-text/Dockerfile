FROM ubuntu:16.04

ARG COMMIT
ENV COMMIT ${COMMIT:-master}

RUN apt-get update && apt-get install -y \
    autoconf automake build-essential curl git libsnappy-dev libtool pkg-config

RUN git clone https://github.com/openvenues/libpostal -b $COMMIT

COPY ./*.sh /libpostal/

WORKDIR /libpostal
RUN ./build_libpostal.sh


ENV NODE_PATH         /usr/local
ENV BASE_DIR          /usr/app
ENV NODE_ENGINE       12.4.0
ENV NODE_PATH         /usr/local

ENV DEBIAN_FRONTEND     noninteractive
ENV LIBPOSTAL_VERSION   v1.0.0
ENV LIBPOSTAL_DIR       /opt/libpostal
ENV LIBPOSTAL_DATA_DIR  /opt/libpostal_data

ENV PATH $NODE_PATH/bin/:$PATH

# Create some needed directories
RUN mkdir -p $NODE_PATH /app/.profile.d

# Install node
RUN curl -s https://s3pository.heroku.com/node/v$NODE_ENGINE/node-v$NODE_ENGINE-linux-x64.tar.gz | tar --strip-components=1 -xz -C $NODE_PATH

# Export the node path in .profile.d
RUN echo "export PATH=\"$NODE_PATH/bin:\$PATH\"" > /app/.profile.d/nodejs.sh
##############

RUN apt-get update && apt-get install python2.7 -y && ln -s /usr/bin/python2.7 /usr/bin/python

COPY package*.json ./
COPY . .
RUN mkdir -p $BASE_DIR
WORKDIR $BASE_DIR
ADD . $BASE_DIR

# Install dependencies: Node bindings
WORKDIR $BASE_DIR
RUN if [ -d node_modules ]; then rm -rf node_modules; fi

RUN npm install -g node-gyp
RUN npm install

VOLUME $BASE_DIR

CMD ["npm", "start"]