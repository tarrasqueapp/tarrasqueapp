FROM node:18-alpine AS builder

RUN yarn global add turbo

WORKDIR /app

COPY . .

RUN turbo prune --scope=api --docker


FROM node:18-alpine AS installer

RUN apk update

WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/apps/api/prisma ./prisma

RUN yarn install --frozen-lockfile

RUN yarn prisma generate


FROM node:18-alpine AS sourcer

WORKDIR /app

COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore

COPY package.json /root/
RUN jq -r .version /root/package.json > /root/.version

RUN export VERSION=$(cat /root/.version) && yarn turbo run build --filter=api...


FROM node:18-alpine AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=mwader/static-ffmpeg:5.1.2 /ffmpeg /usr/local/bin/
COPY --from=mwader/static-ffmpeg:5.1.2 /ffprobe /usr/local/bin/

COPY --from=sourcer --chown=nestjs:nodejs /app/ .

COPY package.json /root/
RUN jq -r .version /root/package.json > /root/.version

CMD export VERSION=$(cat /root/.version) && node apps/api/dist/main.js
