FROM node:16-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile --network-timeout 600000 && yarn cache clean

COPY . ./

CMD yarn dev
