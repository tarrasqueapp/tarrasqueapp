FROM node:18-alpine AS base

RUN npm install --global pnpm

RUN apk add --update --no-cache libc6-compat

WORKDIR /app


FROM base AS builder

RUN pnpm add --global turbo

COPY . .

RUN turbo prune --scope=@tarrasque/api --docker


FROM base AS installer

# Copy only the files needed to install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the files
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Generate prisma client
RUN pnpm api exec prisma generate

# Build the app
RUN pnpm build:api


FROM base AS runner

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
CMD pnpm start:api
