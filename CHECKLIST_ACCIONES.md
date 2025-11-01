# ✅ CHECKLIST DE ACCIONES INMEDIATAS

**Basado en la auditoría del proyecto NeuroPlan MVP**

---

## 🔴 PRIORIDAD ALTA - Hacer AHORA

### Limpieza del Repositorio
- [x] Eliminar `test-register.json`
- [x] Eliminar `backend/env.temp`
- [x] Eliminar `backend/env.supabase`
- [x] **Eliminar carpeta `backend/dist/` completa** ⚠️ IMPORTANTE ✅ COMPLETADO
- [x] Eliminar `backend/backend.log` y `frontend/frontend.log` ✅ COMPLETADO
- [ ] Mover o eliminar `backup.sql`
- [x] Actualizar `.gitignore`

### Consolidación de Documentación
- [ ] Consolidar `MIGRATION_STATUS.md`, `MIGRATION_COMPLETE.md`, `MIGRATION_GUIDE.md` → `MIGRATION.md`
- [ ] Consolidar `PROBLEMA_REGISTRO_RESUELTO.md`, `CAMBIOS_REALIZADOS.md`, `ENDPOINTS_CORREGIDOS_FINAL.md` → `CHANGELOG.md`
- [ ] Consolidar guías del frontend → `frontend/DOCUMENTATION.md`
- [ ] Crear `docs/` y mover archivos históricos allí

### Scripts SQL
- [ ] Crear estructura `backend/sql/`:
  ```
  backend/sql/
  ├── schema.sql (esquema principal)
  ├── migrations/ (versiones)
  └── seed.sql (datos de prueba)
  ```
- [ ] Mover y consolidar archivos SQL duplicados

---

## 🟡 PRIORIDAD MEDIA - Esta Semana

### Testing Básico
- [ ] Crear estructura de tests:
  ```
  backend/src/
  ├── modules/
  │   └── auth/
  │       └── auth.service.spec.ts
  └── modules/
      └── peis/
          └── peis.service.spec.ts
  ```
- [ ] Implementar tests de autenticación (login, registro, JWT)
- [ ] Implementar tests de generación de PEI (mock)
- [ ] Configurar Jest para backend
- [ ] Configurar Vitest para frontend

### Seguridad
- [ ] Revisar y completar RLS en todas las tablas Supabase
- [ ] Implementar rate limiting (usar `@nestjs/throttler`)
- [ ] Revisar validaciones de DTOs en todos los endpoints
- [ ] Implementar logger centralizado (Winston o Pino)

### Código
- [ ] Estandarizar manejo de errores (clase Error personalizada)
- [ ] Revisar y eliminar `any` explícitos en TypeScript
- [ ] Habilitar TypeScript strict mode
- [ ] Extraer lógica duplicada a servicios compartidos

---

## 🟢 PRIORIDAD BAJA - Próximas 2 Semanas

### Migración a AWS
- [ ] Instalar SDK de AWS Bedrock:
  ```bash
  npm install @aws-sdk/client-bedrock-runtime
  ```
- [ ] Crear servicio de migración Ollama → Bedrock
- [ ] Implementar fallback: Ollama (dev) / Bedrock (prod)
- [ ] Instalar AWS Textract SDK
- [ ] Integrar Textract en `uploads.service.ts`
- [ ] Configurar AWS S3 bucket
- [ ] Migrar almacenamiento local → S3

### CI/CD
- [ ] Configurar GitHub Actions o GitLab CI
- [ ] Crear workflow de tests automáticos
- [ ] Crear workflow de build
- [ ] Crear workflow de deploy (staging/prod)
- [ ] Configurar linting automático

### Documentación
- [ ] Configurar Swagger/OpenAPI completo
- [ ] Documentar todos los endpoints
- [ ] Crear guía de desarrollo para nuevos desarrolladores
- [ ] Documentar arquitectura AWS

---

## 📊 SEGUIMIENTO

### Métricas de Progreso

**Fase 1: Limpieza**
- [ ] 0/7 tareas completadas

**Fase 2: Correcciones**
- [ ] 0/8 tareas completadas

**Fase 3: AWS Migration**
- [ ] 0/6 tareas completadas

**Fase 4: CI/CD**
- [ ] 0/5 tareas completadas

---

## 🎯 OBJETIVO FINAL

**MVP Completo en 3-4 semanas**

- ✅ Repositorio limpio y organizado
- ✅ Tests básicos implementados
- ✅ Migrado a AWS para producción
- ✅ CI/CD funcionando
- ✅ Documentación completa
- ✅ Listo para lanzamiento beta

---

## 📝 NOTAS

- Marcar las tareas como completadas con `[x]`
- Actualizar este checklist semanalmente
- Priorizar las tareas de Prioridad Alta primero
- No avanzar a Fase 2 hasta completar Fase 1

---

**Última actualización:** ${new Date().toLocaleDateString('es-ES')}

