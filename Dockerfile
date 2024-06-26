FROM node:lts-alpine AS base

WORKDIR /app

FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json yarn.lock* .yarnrc.yml ./

RUN corepack enable && corepack prepare yarn@stable --activate
RUN yarn --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/.next/cache/images && chown -R node:node /app/.next/cache

RUN corepack enable && corepack prepare yarn@stable --activate
RUN yarn build

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN chown -R nextjs:nodejs /app

USER root
RUN apk add --no-cache curl
USER nextjs

ENV HOSTNAME "0.0.0.0"
ENV PORT 3000
EXPOSE 3000

CMD ["node", "server.js"]