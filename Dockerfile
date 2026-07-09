
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./


RUN npm ci

# Copy source code
COPY . .


FROM node:20-alpine

WORKDIR /app


COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

RUN npm prune --production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

USER nodejs


EXPOSE 3000

# Health check 
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]