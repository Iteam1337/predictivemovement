FROM node:14.9-slim as base

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --quiet

COPY . .

RUN npm run build


## --

FROM node:14.9-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --only=production --no-optional --no-fund

COPY --from=base /app/dist/src ./dist

CMD npm start
