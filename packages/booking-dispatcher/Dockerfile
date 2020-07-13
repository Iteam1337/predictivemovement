FROM node:slim
WORKDIR /app
COPY data .
COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci
COPY . .

CMD npm start
