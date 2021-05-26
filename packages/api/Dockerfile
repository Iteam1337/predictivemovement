FROM node:14.15-slim as base

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --quiet

COPY . .

RUN npm run generate-ts
RUN npm run spec:build
RUN npm run build


## --

FROM node:14.15-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --only=production --no-optional --no-fund

COPY --from=base /app/dist ./
COPY --from=base /app/spec ./spec

CMD ["node", "index.js"]
