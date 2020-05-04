FROM node:slim as build
WORKDIR /app
COPY ./package.json .
RUN npm install --production
COPY . .
RUN npm run build