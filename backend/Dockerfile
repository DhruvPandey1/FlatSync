# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built node_modules and source code from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/Admin ./Admin
COPY --from=builder /app/Users ./Users
COPY --from=builder /app/db ./db

# Expose port (default from server.js is 5000)
EXPOSE 5000

# Start server
CMD ["npm", "run", "dev"]
# Alternatively, to run without nodemon in production:
# CMD ["node", "server.js"]
