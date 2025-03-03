FROM node:lts-alpine AS base

WORKDIR /app
COPY . .

FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./
COPY --chown=nextjs:nodejs public ./public

RUN mkdir -p /app/.next/cache/images && chown -R nextjs:nodejs /app

USER nextjs

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]