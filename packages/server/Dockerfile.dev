FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma prisma

RUN yarn install --pure-lockfile --network-timeout 600000 && yarn cache clean

COPY . .

CMD yarn start:dev
