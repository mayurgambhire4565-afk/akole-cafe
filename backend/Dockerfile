FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate

FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma db push && node dist/server.js"]
