# Dockerfile pour l'API
# on utilise node alpine parce que c'est plus leger

# etape 1: build du typescript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# etape 2: image de prod (sans les devDependencies)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
