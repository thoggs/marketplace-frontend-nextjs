FROM node:lts-alpine AS runner

WORKDIR /app

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]