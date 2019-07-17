FROM node:12

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --quiet

COPY . .

CMD ["sh", "-c", "npm run build && npm run webpack:production && npx serve --listen 4000 --no-clipboard --single build"]