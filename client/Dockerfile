FROM node:25 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:25-alpine

WORKDIR /app

COPY --from=builder /app/dist/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist/static ./dist/static

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]