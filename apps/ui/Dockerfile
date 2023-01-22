FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update
RUN yarn global add turbo

WORKDIR /app

COPY . .

RUN turbo prune --scope=ui --docker


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

ARG HOST
ARG AXIOS_BASE_URL
ARG NODE_ENV
ARG JWT_ACCESS_TOKEN_EXPIRATION_TIME

COPY package.json ./package-root.json
RUN jq -r .version ./package-root.json > ./.version

RUN export VERSION=$(cat ./.version) && yarn turbo run build --filter=ui...


FROM node:18-alpine AS runner

RUN apk add --no-cache libc6-compat jq
RUN apk update

WORKDIR /app

COPY package.json ./package-root.json
RUN jq -r .version ./package-root.json > ./.version

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/ui/next.config.js .
COPY --from=installer /app/apps/ui/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/ui/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/ui/.next/static ./apps/ui/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/ui/public ./apps/ui/.next/standalone/public

CMD export VERSION=$(cat ./.version) && node apps/ui/server.js
