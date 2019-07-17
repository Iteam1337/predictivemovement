FROM node:12

WORKDIR /app

# ARG API_HOST
# ARG GOOGLE_API_TOKEN
# ARG MAPBOX_TOKEN

COPY package.json .
COPY package-lock.json .

RUN npm ci --quiet

COPY . .

# RUN echo "API_HOST=${API_HOST}" > .env
# RUN echo "GOOGLE_API_TOKEN=${GOOGLE_API_TOKEN}" >> .env
# RUN echo "MAPBOX_TOKEN=${MAPBOX_TOKEN}" >> .env

# RUN npm run build && npm run webpack:production

# Start nginx server and move built files
# FROM nginx

# RUN echo '\
#   server {\n\
#   listen 80 default_server;\n\
#   listen [::]:80 default_server;\n\
#   server_name _;\n\
#   root /usr/share/nginx/html;\n\
#   location / {\n\
#   try_files $uri $uri/ /index.html;\n\
#   }\n\
#   }' > /etc/nginx/conf.d/default.conf

# COPY --from=builder /app/build /usr/share/nginx/html

CMD serve --listen 4000 --no-clipboard --single build