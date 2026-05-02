# Guía de Deployment - EventSync

## 🚀 Deployment en Vercel (Recomendado)

### Paso 1: Preparar Repositorio Git
```bash
git init
git add .
git commit -m "Initial EventSync commit"
git remote add origin <tu-repo-url>
git push -u origin main
```

### Paso 2: Conectar a Vercel
1. Ir a [vercel.com](https://vercel.com)
2. Clickear "New Project"
3. Importar repositorio Git
4. Configurar variables de entorno

### Paso 3: Variables de Entorno
En el dashboard de Vercel, agregar:
```
NEXT_PUBLIC_API_URL=https://tu-api.com/api
```

### Paso 4: Deploy
Vercel desplegará automáticamente en cada push a main.

---

## 🏠 Deployment en Casa / VPS

### Requisitos
- Node.js 18+
- pnpm o npm
- Nginx o similar (reverse proxy)
- PM2 (process manager)

### Instalación Local

```bash
# 1. Clonar repo
git clone <tu-repo-url>
cd eventsync

# 2. Instalar dependencias
pnpm install

# 3. Crear .env.production
NEXT_PUBLIC_API_URL=https://api.tudominio.com/api

# 4. Build
pnpm build

# 5. Iniciar con PM2
pm2 start "pnpm start" --name eventsync
pm2 save
```

### Configurar Nginx
```nginx
server {
    listen 80;
    server_name eventsync.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL (Let's Encrypt)
```bash
sudo certbot certonly --nginx -d eventsync.tudominio.com
```

---

## ☁️ Deployment en AWS

### EC2 Setup
```bash
# 1. Launch EC2 instance (Ubuntu 22.04)

# 2. SSH e instalar
ssh -i key.pem ubuntu@instance-ip

# 3. Update system
sudo apt update && sudo apt upgrade -y

# 4. Instalar Node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 5. Instalar pnpm
npm install -g pnpm

# 6. Clone y deploy
git clone <repo-url>
cd eventsync
pnpm install
pnpm build

# 7. PM2
npm install -g pm2
pm2 start "pnpm start" --name eventsync
pm2 startup
pm2 save
```

### CloudFront (CDN)
1. Crear distribución CloudFront
2. Origin: ALB con Next.js
3. Cache policy: Optimized

---

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:5000/api
    depends_on:
      - api

  api:
    image: tu-api-image
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://...
```

### Deploy
```bash
docker-compose up -d
```

---

## 🔄 CI/CD con GitHub Actions

### .github/workflows/deploy.yml
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📋 Checklist de Pre-Deploy

### Código
- ✅ Tests pasando
- ✅ Build sin errores
- ✅ No console.log [v0] en producción
- ✅ Tipos TypeScript correctos
- ✅ Variables de entorno configuradas

### Seguridad
- ✅ HTTPS/SSL configurado
- ✅ Variables secretas en .env
- ✅ No secrets en git
- ✅ CORS configurado correctamente
- ✅ Rate limiting en API

### Performance
- ✅ Images optimizadas
- ✅ Code splitting activo
- ✅ Cache headers correctos
- ✅ Compression activo

### Monitoring
- ✅ Error tracking (Sentry, etc)
- ✅ Analytics configurado
- ✅ Logs centralizados
- ✅ Uptime monitoring

---

## 🧪 Testing Pre-Deploy

```bash
# Build test
pnpm build

# Start locally
pnpm start

# Test endpoints
curl http://localhost:3000/
curl http://localhost:3000/api/health

# Browser testing
- Probar login admin
- Probar crear evento
- Probar Q&A en sesión live
- Probar favoritos
- Mobile responsiveness
```

---

## 🔐 Configuración de Producción

### next.config.mjs
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        }
      ]
    }
  ]
}

export default nextConfig
```

---

## 📊 Monitoreo

### Vercel Analytics
```bash
# Ya incluido en package.json
@vercel/analytics: 1.6.1
```

### Custom Monitoring
```typescript
// pages/api/health.ts
export async function GET() {
  return Response.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  })
}
```

---

## 🔄 Actualizar en Producción

### Zero-downtime Deploy
```bash
# 1. Commit cambios
git add .
git commit -m "feat: new feature"

# 2. Push (auto-deploys en Vercel)
git push origin main

# 3. Vercel automáticamente:
#    - Builds
#    - Tests
#    - Deploys
#    - Zero downtime
```

### Rollback si es necesario
```bash
# En Vercel dashboard, revertir a deployment anterior
```

---

## 💰 Estimaciones de Costo

### Vercel Pro
- **Costo**: $20/mes
- **Incluye**: 1000 serverless function invocations gratis
- **Escalable**: Paga por uso adicional

### AWS (Estimado)
- EC2: ~$10-50/mes (t3.micro a t3.small)
- RDS: ~$15-100/mes
- CloudFront: ~$0.085/GB
- **Total**: $30-200/mes

### Azure/Google Cloud
- Similar a AWS
- Competitive pricing

---

## 🎯 Post-Deploy Checklist

- ✅ SSL certificate activo
- ✅ DNS configurado correctamente
- ✅ Redirects HTTP → HTTPS
- ✅ Analytics funcionando
- ✅ Email/Alertas configuradas
- ✅ Backups automáticos activos
- ✅ Monitoring activo
- ✅ Usuarios pueden registrarse (si aplica)

---

## 📞 Troubleshooting

### "API Error" en producción
```bash
# Verificar NEXT_PUBLIC_API_URL
# Verificar CORS en API
# Check network tab en DevTools
```

### Build timeout
```bash
# Aumentar timeout en Vercel settings
# Optimizar imports
# Reducir bundle size
```

### Memory issues
```bash
# Aumentar Node memory
NODE_OPTIONS=--max-old-space-size=4096

# O en EC2: aumentar instance size
```

---

## 🚀 Deployment Success!

Una vez deployed, share la URL con:
- ✅ Link a sitio público
- ✅ Admin login: admin@eventsync.com / admin123
- ✅ README con instrucciones
- ✅ Documentación API

🎉 **¡EventSync en producción!**
