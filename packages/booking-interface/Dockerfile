FROM node:14

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --quiet

COPY . .

CMD ["node", "."]