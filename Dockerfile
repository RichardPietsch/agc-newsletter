FROM node:20-bookworm-slim

WORKDIR /app

# Prisma engines require OpenSSL in the runtime image.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run prisma:generate && npx prisma db push && npm run prisma:seed && npm run dev -- --hostname 0.0.0.0 --port 3000"]
