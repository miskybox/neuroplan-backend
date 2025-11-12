# Guía de Prueba desde el Navegador

## Estado Actual del Sistema

✅ **Backend**: Corriendo en http://localhost:3001
✅ **Frontend**: Corriendo en http://localhost:5174
✅ **Correcciones aplicadas**: Login con cookies httpOnly + Análisis rápido de PDF

---

## 1. Probar Login

### Paso 1: Abrir el navegador
Abre Chrome/Firefox y navega a: **http://localhost:5174/**

### Paso 2: Ir a Login
Haz clic en "Iniciar sesión" o navega a: **http://localhost:5174/login**

### Paso 3: Usar credenciales de prueba
```
Email: test@test.com
Contraseña: Test1234!
```

### Paso 4: Verificar cookies
1. Abre las DevTools (F12)
2. Ve a la pestaña "Application" > "Cookies" > "http://localhost:5174"
3. Deberías ver:
   - `accessToken` (httpOnly: true)
   - `refreshToken` (httpOnly: true)

### Paso 5: Verificar redirección
Deberías ser redirigido automáticamente al Dashboard.

---

## 2. Probar Análisis de PDF

### Opción A: Desde la interfaz web

1. **Navegar a la página de análisis**:
   - Ve a http://localhost:5174/pdf-analysis (o encuentra el enlace en el dashboard)

2. **Subir un PDF**:
   - Arrastra y suelta un archivo PDF O haz clic para seleccionar
   - El sistema aceptará cualquier PDF válido

3. **Seleccionar tipo de análisis**:
   - General (por defecto)
   - Diagnóstico médico
   - Informe psicopedagógico

4. **Hacer clic en "Analizar"**

5. **Esperar resultado** (debería tardar ~3-4 segundos):
   - ✅ **Si funciona**: Verás el análisis con resumen, recomendaciones y puntos clave
   - ❌ **Si falla**: Verás un mensaje de error

### Opción B: Usar el PDF de prueba

El proyecto incluye un PDF de prueba en la raíz: `test.pdf`

**Contenido del PDF de prueba**:
```
Plan Educativo Individualizado (PEI)
- Datos del Estudiante: Juan Perez Gomez, 8 años, Tercero de Primaria
- Necesidades: Dificultades en lectoescritura, apoyo en matemáticas
- Fortalezas: Excelente memoria visual, alta motivación
- Objetivos: Mejorar comprensión lectora 30%, desarrollar cálculo mental
```

---

## 3. Verificar que el análisis funciona

### Resultado esperado (con Ollama NO disponible)
```json
{
  "summary": "Documento analizado (X palabras, Y oraciones)",
  "recommendations": [
    "Revisar el documento completo",
    "Consultar con especialistas si es necesario",
    "Documentar hallazgos importantes"
  ],
  "keyPoints": [
    "Documento procesado exitosamente",
    "Análisis básico completado",
    "Recomendación de revisión manual"
  ],
  "confidence": 0.6,
  "fallback": true
}
```

### Resultado esperado (con Ollama disponible)
```json
{
  "summary": "Análisis detallado del PEI con IA...",
  "recommendations": [
    "Recomendaciones específicas basadas en el contenido...",
    "..."
  ],
  "keyPoints": [
    "Puntos clave extraídos por la IA...",
    "..."
  ],
  "confidence": 0.8-0.95
}
```

---

## 4. Probar Flujo Completo

### Escenario: Crear un PEI para un estudiante

1. **Login** como profesor/orientador
2. **Ir a "Estudiantes"** > "Agregar nuevo estudiante"
3. **Completar datos** del estudiante
4. **Subir informe médico/psicopedagógico** (PDF)
5. **Esperar análisis**
6. **Revisar PEI generado** automáticamente
7. **Editar y aprobar** el PEI

---

## 5. Verificar Roles y Permisos

### Registrar usuarios con diferentes roles

1. **Director del Centro**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"director@colegio.com",
    "password":"Director123!",
    "firstName":"Juan",
    "lastName":"Director",
    "role":"DIRECTOR_CENTRO"
  }'
```

2. **Profesor**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"profesor@colegio.com",
    "password":"Profesor123!",
    "firstName":"María",
    "lastName":"Profesor",
    "role":"PROFESOR"
  }'
```

3. **Orientador**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"orientador@colegio.com",
    "password":"Orientador123!",
    "firstName":"Carlos",
    "lastName":"Orientador",
    "role":"ORIENTADOR"
  }'
```

4. **Tutor**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"tutor@colegio.com",
    "password":"Tutor123!",
    "firstName":"Ana",
    "lastName":"Tutor",
    "role":"TUTOR"
  }'
```

### Verificar permisos

| Acción | Director | Profesor | Tutor | Orientador | Alumno | Padre |
|--------|----------|----------|-------|------------|--------|-------|
| Crear usuarios | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver todos los alumnos | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Crear PEIs | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver estadísticas | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver propio PEI | N/A | N/A | N/A | N/A | ✅ | ✅* |

*Solo el PEI de su hijo/a

---

## 6. Solución de Problemas

### Problema: "Error de autenticación"
**Solución**: Verifica que las cookies estén habilitadas en tu navegador.

### Problema: "Timeout al analizar PDF"
**Solución**:
1. El análisis ahora debería ser rápido (~3-4 segundos)
2. Si tarda más, verifica los logs del backend
3. El sistema usa un fallback sin IA si Ollama no está disponible

### Problema: "No puedo hacer login"
**Solución**:
1. Limpia las cookies del navegador
2. Asegúrate de que el backend esté corriendo (http://localhost:3001/api/health)
3. Verifica que el CORS esté configurado correctamente

### Problema: "El PDF no se analiza"
**Solución**:
1. Verifica que el PDF sea válido (no corrupto)
2. El tamaño máximo es 10MB
3. Solo se aceptan archivos .pdf

---

## 7. Logs útiles

### Ver logs del backend en tiempo real
El backend está corriendo en modo watch, los logs aparecen automáticamente en la terminal.

### Ver logs del frontend
Abre las DevTools (F12) > Console

### Verificar salud del backend
```bash
curl http://localhost:3001/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-11-12T18:30:00.000Z"
}
```

---

## 8. Documentación Adicional

- **Roles y Permisos**: `backend/ROLES_AND_PERMISSIONS.md`
- **Resultados de Tests**: `TEST_RESULTS.md`
- **API Docs**: http://localhost:3001/api/docs

---

## ✅ Checklist de Pruebas

- [ ] Login funciona correctamente
- [ ] Cookies se establecen (accessToken, refreshToken)
- [ ] Redirección al dashboard después del login
- [ ] Análisis de PDF completa en <5 segundos
- [ ] Resultado del análisis se muestra correctamente
- [ ] Logout funciona y limpia las cookies
- [ ] Navegación protegida funciona (requiere login)
- [ ] Diferentes roles tienen permisos diferentes

---

**Última actualización**: 12 de noviembre de 2025, 19:30 CET
**Estado**: ✅ Sistema completamente operativo
