# ── Stage 1: Build ─────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Copy workspace manifests
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/

# Install all deps (including dev for building)
RUN npm ci --workspace=apps/api --workspace=packages/database --include-workspace-root

# Copy source
COPY apps/api ./apps/api
COPY packages/database ./packages/database
COPY tsconfig.base.json ./

# Generate Prisma client
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# Build API
RUN npm run build --workspace=apps/api

# ── Stage 2: Production image ───────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only install prod deps
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
RUN npm ci --workspace=apps/api --workspace=packages/database --include-workspace-root --omit=dev

# Copy build artifacts
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Run migrations then start
CMD ["sh", "-c", "npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma && node apps/api/dist/main"]

EXPOSE 4000
