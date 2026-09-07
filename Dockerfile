FROM node:24-bookworm-slim AS base

WORKDIR /app


# ──────────────────────────────────────
# Dependencies
# ──────────────────────────────────────
FROM base AS deps

COPY package*.json ./

RUN npm ci


# ──────────────────────────────────────
# Build
# ──────────────────────────────────────
FROM deps AS build

COPY . .

RUN node ace build


# ──────────────────────────────────────
# Production
# ──────────────────────────────────────
FROM base AS production

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333

WORKDIR /app

COPY --from=build /app/build ./

RUN npm ci --omit=dev \
    && npm cache clean --force

USER node

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3333/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["node", "bin/server.js"]