FROM node:12.6

WORKDIR /app

COPY package*json /app/

RUN npm ci

COPY lib ./lib

ENV USER=normal-user
RUN adduser --disabled-password --gecos "" $USER
USER $USER

CMD ["sh", "-c", "node ."]