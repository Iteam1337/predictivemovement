FROM node:14.9-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --quiet

COPY . .

CMD npm start
