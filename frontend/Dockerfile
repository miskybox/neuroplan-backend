# Multi-stage build
FROM node:20.18-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY postcss.config.ts ./
COPY tailwind.config.ts ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src ./src
COPY public ./public

# Build para producción
RUN npm run build

# Etapa de producción con nginx
FROM nginx:alpine

# Copiar build al servidor nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
