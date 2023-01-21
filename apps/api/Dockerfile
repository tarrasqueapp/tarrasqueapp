FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update
RUN yarn global add turbo

WORKDIR /app

COPY . .

RUN turbo prune --scope=api --docker


FROM node:18-alpine AS installer

RUN apk add --no-cache libc6-compat jq
RUN apk update

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN yarn workspace api prisma generate

COPY package.json ./package-root.json
RUN jq -r .version ./package-root.json > ./.version

RUN export VERSION=$(cat ./.version) && yarn turbo run build --filter=api...


FROM node:18-alpine AS runner

WORKDIR /app

COPY package.json ./package-root.json
RUN jq -r .version ./package-root.json > ./.version

# Don't run production as root
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=mwader/static-ffmpeg:5.1.2 /ffmpeg /usr/local/bin/
COPY --from=mwader/static-ffmpeg:5.1.2 /ffprobe /usr/local/bin/

COPY --from=installer /app .

CMD export VERSION=$(cat ./.version) && node apps/api/dist/main.js
