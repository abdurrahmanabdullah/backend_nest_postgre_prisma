FROM node:18-alpine AS base

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Add a clean build step when triggered by GitHub Actions
ARG CLEAN_BUILD=false
RUN if [ "$CLEAN_BUILD" = "true" ]; then npm run clean || true; fi

RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Create user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Create all necessary directories with proper permissions
RUN mkdir -p /app/public && \
    mkdir -p /app/public/favicon && \
    mkdir -p /app/.next/static && \
    mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app && \
    chmod -R 755 /app

# Copy public directory first
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public/favicon ./public/favicon

# Ensure favicon directory exists and set permissions
RUN mkdir -p ./public/favicon && \
    chown -R nextjs:nodejs /app && \
    chmod -R 755 /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]