# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3000

# NGINX設定ファイルをコンテナにコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf