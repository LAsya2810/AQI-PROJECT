# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run production build
RUN npm install -g serve

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Run production build
CMD ["serve", "-s", "build", "-l", "3000"]
