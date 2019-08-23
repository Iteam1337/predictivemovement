FROM node:12.9-alpine

WORKDIR /app

COPY package*json /app/

RUN npm ci

COPY lib ./lib

ENV USER=normal-user
RUN adduser --disabled-password --gecos "" $USER
USER $USER

CMD npm start
