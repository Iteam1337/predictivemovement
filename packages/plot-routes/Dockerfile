FROM node:12.9-alpine as builder

WORKDIR /build

COPY package*json ./

RUN npm ci

COPY . .

RUN node_modules/typescript/bin/tsc

RUN ls -A | grep -v dist | xargs rm -rf
RUN find dist -type d -name '__*' -exec rm -r {} +;

##

FROM node:12.9-alpine

WORKDIR /app

COPY package*json ./
RUN npm ci --production

COPY --from=builder /build/dist ./dist

ENV USER=normal-user
RUN adduser --disabled-password --gecos "" $USER
USER $USER

CMD node dist/index.js
