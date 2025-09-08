# Quest Wall 部署与 CI/CD 配置

## 1. GitHub Actions CI/CD 配置

### .github/workflows/backend.yml

```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'questwall-backend/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'questwall-backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: questwall-backend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd questwall-backend
        npm ci
    
    - name: Run tests
      run: |
        cd questwall-backend
        npm run test
    
    - name: Run lint
      run: |
        cd questwall-backend
        npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: questwall-backend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd questwall-backend
        npm ci
    
    - name: Build
      run: |
        cd questwall-backend
        npm run build
    
    - name: Deploy to server
      run: |
        # 这里添加部署到服务器的命令
        echo "Deploying to server..."
```

### .github/workflows/frontend.yml

```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'questwall-tma/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'questwall-tma/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: questwall-tma/package-lock.json
    
    - name: Install dependencies
      run: |
        cd questwall-tma
        npm ci
    
    - name: Run lint
      run: |
        cd questwall-tma
        npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: questwall-tma/package-lock.json
    
    - name: Install dependencies
      run: |
        cd questwall-tma
        npm ci
    
    - name: Build
      run: |
        cd questwall-tma
        npm run build
    
    - name: Deploy to CDN
      run: |
        # 这里添加部署到 CDN 的命令
        echo "Deploying to CDN..."
```

## 2. Kubernetes 部署配置

### k8s/backend-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: questwall-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: questwall-backend
  template:
    metadata:
      labels:
        app: questwall-backend
    spec:
      containers:
      - name: backend
        image: questwall/backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: questwall-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: questwall-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: questwall-backend
spec:
  selector:
    app: questwall-backend
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
```

### k8s/frontend-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: questwall-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: questwall-frontend
  template:
    metadata:
      labels:
        app: questwall-frontend
    spec:
      containers:
      - name: frontend
        image: questwall/frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: questwall-frontend
spec:
  selector:
    app: questwall-frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

### k8s/database-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: questwall-postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: questwall-postgres
  template:
    metadata:
      labels:
        app: questwall-postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: questwall
        - name: POSTGRES_USER
          value: questwall
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: questwall-secrets
              key: postgres-password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: questwall-postgres
spec:
  selector:
    app: questwall-postgres
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP
```

### k8s/redis-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: questwall-redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: questwall-redis
  template:
    metadata:
      labels:
        app: questwall-redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: questwall-redis
spec:
  selector:
    app: questwall-redis
  ports:
  - port: 6379
    targetPort: 6379
  type: ClusterIP
```

## 3. Secrets 管理

### secrets.yaml

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: questwall-secrets
type: Opaque
data:
  # 需要使用 base64 编码
  database-url: <base64 encoded database url>
  jwt-secret: <base64 encoded jwt secret>
  postgres-password: <base64 encoded postgres password>
```

## 4. 监控与日志

### prometheus.yml

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'questwall-backend'
    static_configs:
      - targets: ['questwall-backend:3000']

  - job_name: 'questwall-frontend'
    static_configs:
      - targets: ['questwall-frontend:80']

  - job_name: 'questwall-postgres'
    static_configs:
      - targets: ['questwall-postgres:5432']

  - job_name: 'questwall-redis'
    static_configs:
      - targets: ['questwall-redis:6379']
```

### grafana-dashboard.json

```json
{
  "dashboard": {
    "title": "Quest Wall Monitoring",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "stat",
        "targets": [
          {
            "expr": "count(questwall_active_users)"
          }
        ]
      },
      {
        "title": "Task Completion Rate",
        "type": "gauge",
        "targets": [
          {
            "expr": "questwall_task_completion_rate"
          }
        ]
      }
    ]
  }
}
```