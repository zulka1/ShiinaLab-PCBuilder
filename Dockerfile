# ==============================================================================
# Hardened Multi-Stage Dockerfile — ShiinaLab PC Builder (sec-0.2)
# Sesuai CIS Benchmark, Least Privilege (Non-Root UID 1001), dan Minimal Attack Surface
# ==============================================================================

# Tahap 1: Base Alpine Image yang Ringan dan Bersih
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Tahap 2: Instalasi Dependensi
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Tahap 3: Builder Aplikasi
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client untuk PostgreSQL
RUN npx prisma generate

# Build Next.js Production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Tahap 4: Production Runner (Hardened & Non-Root)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Membuat Grup dan Pengguna Sistem Non-Root (Least Privilege: UID 1001, GID 1001)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Salin aset publik dan file yang dibutuhkan dengan hak akses non-root
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Beralih ke Pengguna Non-Root
USER nextjs

EXPOSE 3000

# Healthcheck Container
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["npm", "start"]
