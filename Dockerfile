FROM node:22-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
ENV PORT=10000
EXPOSE 10000
CMD ["node", "dist/main.js"]
