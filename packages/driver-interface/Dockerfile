FROM node:14.9-slim as base

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --quiet

COPY . .

CMD npm run build


## --

FROM node:14.9-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --quiet

COPY --from=base /app/dist ./dist/

CMD npm start
