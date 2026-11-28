# ALTHERA MVP — single image serving API + PWA client on :8787
FROM node:20-alpine AS base
WORKDIR /app

# better-sqlite3 needs build tools for its native addon
RUN apk add --no-cache python3 make g++

COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --omit=dev

COPY server ./server
COPY client ./client
ENV NODE_ENV=production PORT=8787
EXPOSE 8787

WORKDIR, /app/server
VOLUME /app/server/data
CMD ["node", "src/index.js"]
