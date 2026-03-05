# syntax=docker/dockerfile:1

# ─── Stage 1: Install dependencies ───────────────────────────────────────────
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ─── Stage 2: Build ───────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# Copy deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are embedded at build time — pass via --build-arg
ARG NEXT_PUBLIC_PROVIDER_A_PUBLIC_KEY
ARG NEXT_PUBLIC_PROVIDER_A_ASSISTANT_ID_SALES
ARG NEXT_PUBLIC_PROVIDER_A_ASSISTANT_ID_UZ
ARG NEXT_PUBLIC_PROVIDER_B_AGENT_ID_SUPPORT
ARG NEXT_PUBLIC_PROVIDER_B_AGENT_ID_ANNA

ENV NEXT_PUBLIC_PROVIDER_A_PUBLIC_KEY=$NEXT_PUBLIC_PROVIDER_A_PUBLIC_KEY
ENV NEXT_PUBLIC_PROVIDER_A_ASSISTANT_ID_SALES=$NEXT_PUBLIC_PROVIDER_A_ASSISTANT_ID_SALES
ENV NEXT_PUBLIC_PROVIDER_A_ASSISTANT_ID_UZ=$NEXT_PUBLIC_PROVIDER_A_ASSISTANT_ID_UZ
ENV NEXT_PUBLIC_PROVIDER_B_AGENT_ID_SUPPORT=$NEXT_PUBLIC_PROVIDER_B_AGENT_ID_SUPPORT
ENV NEXT_PUBLIC_PROVIDER_B_AGENT_ID_ANNA=$NEXT_PUBLIC_PROVIDER_B_AGENT_ID_ANNA

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ─── Stage 3: Production runner ───────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
