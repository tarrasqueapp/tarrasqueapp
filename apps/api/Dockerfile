FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update
RUN yarn global add turbo

WORKDIR /app

COPY . .

RUN turbo prune --scope=@tarrasque/api --docker


FROM node:18-alpine AS installer

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

# Copy only the files needed to install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

# Install dependencies
RUN yarn install

# Copy the rest of the files
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Generate prisma client
RUN yarn api prisma generate

# Build the app
RUN yarn build:api


FROM node:18-alpine AS runner

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Install ffmpeg
COPY --from=mwader/static-ffmpeg:5.1.2 /ffmpeg /usr/local/bin/
COPY --from=mwader/static-ffmpeg:5.1.2 /ffprobe /usr/local/bin/

# Copy the built app
COPY --from=installer /app .

# Start the production server
CMD yarn start:api
