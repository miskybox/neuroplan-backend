# 🧪 TEST: Upload con studentId en FormData

## ✅ Nuevo Endpoint Agregado

**Ruta:** `POST /api/uploads/reports`

**Diferencias con el endpoint anterior:**
- ❌ Antiguo: `POST /api/uploads/reports/:studentId` (studentId en URL)
- ✅ Nuevo: `POST /api/uploads/reports` (studentId en FormData)

## 📋 Formato del Request

```bash
# Crear un archivo de prueba
echo "Test PDF content" > test-report.txt

# Obtener un studentId válido primero
curl http://localhost:3001/api/uploads/students

# Usar el ID del estudiante en el FormData
curl -X POST http://localhost:3001/api/uploads/reports \
  -F "file=@test-report.txt" \
  -F "studentId=TU_STUDENT_ID_AQUI"
```

## 🎯 Validaciones Implementadas

1. ✅ Valida que `file` esté presente
2. ✅ Valida que `studentId` esté presente en FormData
3. ✅ Valida que `studentId` sea un string
4. ✅ Valida tipos MIME permitidos (PDF, JPG, JPEG, PNG)
5. ✅ Valida tamaño máximo (10MB)

## ⚠️ Errores Posibles

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "studentId must be a string",
  "error": "Bad Request"
}
```
**Causa:** studentId no se envió como string en FormData

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "studentId es requerido en el FormData",
  "error": "Bad Request"
}
```
**Causa:** No se incluyó studentId en el FormData

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Estudiante no encontrado",
  "error": "Not Found"
}
```
**Causa:** El studentId no existe en la base de datos

## 🔧 Configuración Frontend

### ✅ CORRECTO - FormData con studentId

```typescript
uploadReport: (studentId: number, file: File): Promise<ApiResponse<Report>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('studentId', studentId.toString()); // ✅ Convertir a string
  
  return api.post('/uploads/reports', formData, { // ✅ Sin :studentId en URL
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
```

### ❌ INCORRECTO - Sin studentId

```typescript
// ❌ Falta studentId en FormData
uploadReport: (studentId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  // ❌ ERROR: No se incluyó studentId
  
  return api.post('/uploads/reports', formData);
}
```

## 📊 Respuesta Exitosa

```json
{
  "id": "clxxxxx",
  "filename": "1697028123456-abc123.pdf",
  "originalName": "informe_maria_tdah.pdf",
  "mimeType": "application/pdf",
  "size": 2048576,
  "status": "PENDING",
  "uploadedAt": "2025-10-11T14:30:00.000Z",
  "studentId": "clxxxxx"
}
```

## 🚀 Estado del Backend

- ✅ Backend corriendo en: http://localhost:3001
- ✅ Nuevo endpoint disponible: `POST /api/uploads/reports`
- ✅ Endpoint antiguo sigue funcionando: `POST /api/uploads/reports/:studentId`
- ✅ Documentación Swagger: http://localhost:3001/api/docs

## 🎯 Próximos Pasos

1. Actualizar el frontend para usar el nuevo endpoint
2. Asegurarse de que `studentId` se convierta a string: `studentId.toString()`
3. Usar la ruta `/uploads/reports` sin el parámetro `:studentId`
4. Probar el flujo completo

---

**✅ El backend está listo para recibir uploads con studentId en FormData!**
