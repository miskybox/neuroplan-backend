# 🚢 Guía de Despliegue a Producción - NeuroPlan

## 📋 Checklist Pre-Despliegue

Antes de desplegar, asegúrate de tener:

- [x] ✅ PostgreSQL migrado y funcionando localmente
- [x] ✅ Archivos del hackathon eliminados
- [ ] ⏳ Repository de Git limpio y actualizado
- [ ] ⏳ Variables de entorno de producción listas
- [ ] ⏳ APIs keys de producción configuradas
- [ ] ⏳ Cuenta en Railway.app o Render.com

---

## 🎯 Opción 1: Railway.app (RECOMENDADO)

### Ventajas
- ⚡ Deploy más rápido (5 minutos)
- 💰 $5-10/mes (incluye PostgreSQL)
- 🔄 Auto-deploy desde GitHub
- 📊 Métricas incluidas
- 🔧 CLI poderoso

### Paso 1: Crear cuenta
1. Ve a https://railway.app
2. Sign up con GitHub
3. Autoriza acceso a repositorios

### Paso 2: Nuevo proyecto
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init
```

### Paso 3: Añadir PostgreSQL
```bash
# Desde CLI
railway add postgresql

# O desde web: New → Database → PostgreSQL
```

### Paso 4: Configurar variables de entorno
```bash
# Variables automáticas de Railway:
# DATABASE_URL → Generado automáticamente por Railway

# Configurar las demás manualmente:
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET="$(openssl rand -hex 32)"
railway variables set AWS_REGION=us-east-1
railway variables set AWS_ACCESS_KEY_ID=tu_clave
railway variables set AWS_SECRET_ACCESS_KEY=tu_secreto
railway variables set ELEVENLABS_API_KEY=tu_clave_elevenlabs
railway variables set LINKUP_API_KEY=tu_clave_linkup
railway variables set N8N_WEBHOOK_URL=https://tu-n8n.app.n8n.cloud/webhook/
```

### Paso 5: Deploy
```bash
# Desde CLI
railway up

# O conecta GitHub desde web:
# Settings → Connect GitHub → Select Repo
```

### Paso 6: Ejecutar migraciones
```bash
railway run npx prisma migrate deploy
railway run npx prisma generate
```

### Paso 7: Verificar
```bash
# Obtener URL pública
railway domain

# Probar health check
curl https://tu-app.up.railway.app/health
```

---

## 🎯 Opción 2: Render.com

### Ventajas
- 🆓 Tier gratuito (con limitaciones)
- 📦 Todo en una plataforma
- 🔒 SSL automático
- 📊 Logs detallados

### Paso 1: Crear cuenta
1. Ve a https://render.com
2. Sign up con GitHub

### Paso 2: Nueva base de datos PostgreSQL
1. Dashboard → New → PostgreSQL
2. Name: `neuroplan-db`
3. Plan: **Starter ($7/mes)** o superior
4. Crear y copiar `Internal Database URL`

### Paso 3: Nuevo Web Service
1. Dashboard → New → Web Service
2. Connect GitHub repository
3. Configurar:
   - **Name:** neuroplan-backend
   - **Region:** Frankfurt (más cercano a España)
   - **Branch:** main
   - **Root Directory:** (dejar vacío)
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npm run start:prod`
   - **Plan:** Starter ($7/mes)

### Paso 4: Variables de entorno
En la sección "Environment":

```env
DATABASE_URL=postgresql://usuario:password@host:5432/neuroplan
NODE_ENV=production
PORT=3001
JWT_SECRET=clave-segura-32-caracteres-aleatorios
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_clave
AWS_SECRET_ACCESS_KEY=tu_secreto
ELEVENLABS_API_KEY=tu_clave_elevenlabs
LINKUP_API_KEY=tu_clave_linkup
N8N_WEBHOOK_URL=https://tu-n8n.app.n8n.cloud/webhook/
```

### Paso 5: Deploy
1. Click "Create Web Service"
2. Render automáticamente:
   - Clona el repo
   - Instala dependencias
   - Ejecuta build
   - Inicia la app

### Paso 6: Ejecutar migraciones
En la sección "Shell" del dashboard:
```bash
npx prisma migrate deploy
```

### Paso 7: Verificar
```bash
curl https://neuroplan-backend.onrender.com/health
```

---

## 🔧 Configuración adicional

### Dominios personalizados
**Railway:**
```bash
railway domain add neuroplan.tudominio.com
```

**Render:**
1. Settings → Custom Domains
2. Añadir dominio
3. Configurar CNAME en tu DNS

### Backups automáticos
**Railway:**
- Incluidos automáticamente cada 24h
- Retención: 7 días

**Render:**
- Plan Starter: Backups diarios automáticos
- Retención: 7-30 días según plan

### Monitoreo y Logs
**Railway:**
```bash
railway logs
```

**Render:**
- Dashboard → Logs (tiempo real)
- Métricas de CPU/RAM incluidas

---

## 🚨 Troubleshooting

### Error: "Port already in use"
Render y Railway asignan el puerto automáticamente. Asegúrate de que tu app use `process.env.PORT`:

```typescript
// main.ts
const port = process.env.PORT || 3001;
await app.listen(port);
```

### Error: "Prisma Client not found"
```bash
# Railway
railway run npx prisma generate

# Render (en Shell)
npx prisma generate
```

### Error: "Database connection failed"
Verifica que `DATABASE_URL` tenga el formato correcto:
```
postgresql://usuario:password@host:5432/neuroplan?schema=public
```

### Build timeout
Si el build tarda mucho, optimiza:
```json
// package.json
"scripts": {
  "build": "nest build --webpack"
}
```

---

## 🔒 Seguridad en Producción

### 1. Variables de entorno
❌ **NUNCA** hagas commit de `.env`
✅ Usa `.env.example` como plantilla

### 2. JWT Secret
Genera clave segura:
```bash
openssl rand -hex 32
```

### 3. Rate limiting
Habilitar en producción:
```typescript
// main.ts
import rateLimit from 'express-rate-limit';

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de requests
  })
);
```

### 4. CORS
Configurar dominios permitidos:
```typescript
app.enableCors({
  origin: ['https://tuapp.com', 'https://www.tuapp.com'],
  credentials: true
});
```

---

## 📊 Costos estimados

### Railway.app
- **Hobby Plan:** $5/mes
- **PostgreSQL:** Incluido
- **Total:** ~$5-10/mes

### Render.com
- **Web Service Starter:** $7/mes
- **PostgreSQL Starter:** $7/mes
- **Total:** ~$14/mes

### Comparación
| Feature | Railway | Render |
|---------|---------|--------|
| Precio | $5-10 | $14 |
| Deploy speed | ⚡⚡⚡ | ⚡⚡ |
| CLI | ✅ Excelente | ❌ No tiene |
| Free tier | ❌ | ✅ (limitado) |
| Auto-scale | ✅ | ✅ |

**Recomendación:** Railway.app por precio y velocidad.

---

## 🎯 Post-Despliegue

### 1. Verificar salud
```bash
curl https://tu-app.up.railway.app/health
```

### 2. Probar endpoints
```bash
# Crear estudiante
curl -X POST https://tu-app/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","grade":"3ro Primaria"}'

# Health check
curl https://tu-app/health
```

### 3. Monitorear logs
```bash
# Railway
railway logs --tail

# Render
# Dashboard → Logs
```

### 4. Configurar alertas
- Railway: Settings → Notifications
- Render: Settings → Alerts

---

## 📚 Recursos adicionales

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Prisma Deploy](https://www.prisma.io/docs/guides/deployment)
- [NestJS Production](https://docs.nestjs.com/faq/deployment)

---

**¡Listo para producción!** 🚀

*Última actualización: Enero 2025*
