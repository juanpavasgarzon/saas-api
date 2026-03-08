# ─── Stage 1: Dependencies ───────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Install only production dependencies first for layer caching
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ─── Stage 2: Dev (hot reload – all deps including devDependencies) ──────────
FROM node:22-alpine AS dev

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src

EXPOSE 3000 9229

CMD ["npm", "run", "start:dev"]

# ─── Stage 3: Builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and config files
COPY package.json package-lock.json nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src

# Build the application
RUN npm run build

# Prune devDependencies – keep only production deps in node_modules
RUN npm ci --omit=dev --ignore-scripts

# ─── Stage 3: Runner (production) ────────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nestjs \
    && adduser --system --uid 1001 --ingroup nestjs nestjs

# Copy built artifacts and production node_modules
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --chown=nestjs:nestjs package.json ./

# Switch to non-root user
USER nestjs

# Expose application port (overridden by APP_PORT env var at runtime)
EXPOSE 3000

# Health check – calls /api/health if you add that endpoint, otherwise adjust
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:${APP_PORT:-3000}/api/health || exit 1

# Start the application
CMD ["node", "dist/main"]
