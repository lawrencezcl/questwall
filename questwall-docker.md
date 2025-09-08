# Quest Wall Docker 配置

## 1. 后端服务 Dockerfile

```dockerfile
# 使用 Node.js 18 作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "run", "start:prod"]
```

## 2. 前端服务 Dockerfile

```dockerfile
# 使用 Node.js 18 作为构建环境
FROM node:18-alpine as build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制应用代码
COPY . .

# 构建应用
RUN npm run build

# 使用 nginx 作为生产服务器
FROM nginx:alpine

# 复制构建产物到 nginx 目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
```

## 3. docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL 数据库
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: questwall
      POSTGRES_USER: questwall
      POSTGRES_PASSWORD: questwall123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis 缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # ClickHouse 数据库
  clickhouse:
    image: clickhouse/clickhouse-server:23.3-alpine
    volumes:
      - clickhouse_data:/var/lib/clickhouse
    ports:
      - "8123:8123"
      - "9000:9000"

  # 后端服务
  backend:
    build:
      context: ./questwall-backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://questwall:questwall123@postgres:5432/questwall
      - REDIS_URL=redis://redis:6379
      - CLICKHOUSE_URL=http://clickhouse:8123
    depends_on:
      - postgres
      - redis
      - clickhouse

  # 前端服务
  frontend:
    build:
      context: ./questwall-tma
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  clickhouse_data:
```

## 4. nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```