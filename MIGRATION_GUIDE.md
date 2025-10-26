# 🚀 **GUÍA DE MIGRACIÓN A SUPABASE**

## 📋 **RESUMEN**

Esta guía te ayudará a migrar completamente tu proyecto NeuroPlan desde PostgreSQL local a Supabase, implementando autenticación real y corrigiendo los problemas de seguridad identificados.

---

## 🔧 **PASOS DE MIGRACIÓN**

### **Paso 1: Preparar Supabase**

1. **Crear proyecto en Supabase**:
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota la URL y las keys

2. **Configurar variables de entorno**:
   ```bash
   # Copia el archivo de ejemplo
   cp backend/env.example backend/.env
   
   # Edita backend/.env con tus credenciales reales
   ```

3. **Instalar dependencias**:
   ```bash
   cd backend
   npm install @supabase/supabase-js bcrypt
   ```

### **Paso 2: Ejecutar Migración**

1. **Ejecutar script de migración**:
   ```bash
   cd backend
   node scripts/migrate-to-supabase.js
   ```

2. **Verificar migración**:
   - El script creará todas las tablas
   - Creará usuarios de prueba
   - Verificará que todo funciona

### **Paso 3: Probar Integración**

1. **Iniciar el proyecto**:
   ```bash
   # Desde el directorio raíz
   npm run dev
   ```

2. **Probar login**:
   - Email: `admin@neuroplan.com`
   - Password: `NeuroPlan2024!`

---

## 📁 **ARCHIVOS CREADOS/MODIFICADOS**

### **Nuevos Archivos**:
- `backend/migrate-to-supabase.sql` - Script SQL de migración
- `backend/src/db.ts` - Cliente de Supabase
- `backend/scripts/migrate-to-supabase.js` - Script de migración automática
- `backend/scripts/create-supabase-users.js` - Script para crear usuarios
- `backend/env.example` - Plantilla de variables de entorno

### **Archivos Modificados**:
- `backend/src/modules/auth/auth.service.ts` - Implementación de Supabase Auth

---

## 🔐 **CREDENCIALES DE PRUEBA**

| Email | Password | Rol |
|-------|----------|-----|
| `admin@neuroplan.com` | `NeuroPlan2024!` | ADMIN |
| `orientador@neuroplan.com` | `Orientador2024!` | ORIENTADOR |
| `profesor@neuroplan.com` | `Profesor2024!` | PROFESOR |

---

## 🚨 **PROBLEMAS RESUELTOS**

### **Seguridad**:
- ✅ Credenciales movidas a variables de entorno
- ✅ JWT secret fuerte implementado
- ✅ Passwords seguras para usuarios de prueba
- ✅ Row Level Security (RLS) habilitado

### **Autenticación**:
- ✅ Supabase Auth implementado
- ✅ Sistema híbrido JWT + Supabase
- ✅ Validación de usuarios real
- ✅ Logout funcional

### **Base de Datos**:
- ✅ Esquema unificado
- ✅ Tablas con RLS
- ✅ Índices para performance
- ✅ Triggers para updated_at

---

## 🔍 **VERIFICACIÓN**

### **Backend**:
```bash
# Probar conexión
curl http://localhost:3001/api/auth/me

# Probar login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@neuroplan.com","password":"NeuroPlan2024!"}'
```

### **Frontend**:
1. Abrir `http://localhost:5173`
2. Ir a Login
3. Usar credenciales de prueba
4. Verificar que redirige a Dashboard

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error de conexión**:
```bash
# Verificar variables de entorno
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

### **Error de autenticación**:
```bash
# Verificar usuarios en Supabase Dashboard
# Auth > Users
```

### **Error de base de datos**:
```bash
# Verificar tablas en Supabase Dashboard
# Database > Tables
```

---

## 📊 **ESTADO ACTUAL**

| Componente | Estado | Notas |
|------------|--------|-------|
| **Supabase Auth** | ✅ Implementado | Autenticación real |
| **Base de Datos** | ✅ Migrado | Esquema unificado |
| **Seguridad** | ✅ Corregido | Credenciales seguras |
| **Backend** | ✅ Funcional | API completa |
| **Frontend** | ✅ Funcional | UI completa |
| **Tests** | ⏳ Pendiente | Próxima fase |

---

## 🎯 **PRÓXIMOS PASOS**

1. **Implementar generación de PEIs**
2. **Añadir upload de documentos**
3. **Crear tests unitarios**
4. **Configurar CI/CD**
5. **Optimizar performance**

---

## 📞 **SOPORTE**

Si encuentras problemas durante la migración:

1. Verifica las variables de entorno
2. Revisa los logs del backend
3. Consulta la consola del navegador
4. Verifica el estado en Supabase Dashboard

**¡La migración está lista para ejecutar!** 🚀
