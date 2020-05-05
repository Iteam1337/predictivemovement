FROM node:slim as build
ARG REACT_APP_MAPBOX_ACCESS_TOKEN
ARG REACT_APP_ENGINE_SERVER
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install --production
COPY . .
RUN npm run build

# production environment
FROM nginx:1.16.0-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
