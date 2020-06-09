FROM node:slim as build
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci
COPY . .
ARG REACT_APP_MAPBOX_ACCESS_TOKEN
ARG REACT_APP_ENGINE_SERVER
RUN npm run build

# production environment
FROM nginx:1.16.0-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]