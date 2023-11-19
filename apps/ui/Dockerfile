FROM node:18-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apk add --update --no-cache libc6-compat

WORKDIR /app


FROM base AS builder

RUN pnpm add --global turbo

COPY . .

RUN turbo prune --scope=@tarrasque/ui --docker


FROM base AS installer

# Copy only the files needed to install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/out/patches ./patches/

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the files
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Set build-time variables
ARG HOST
ARG API_BASE_URL
ARG NODE_ENV
ARG JWT_EXPIRES_IN

# Build the app
RUN pnpm build:ui


FROM base AS runner

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy the built app
COPY --from=installer /app .

# Start the production server
CMD pnpm start:ui
