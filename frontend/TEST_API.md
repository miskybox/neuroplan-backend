# 🧪 TEST API - Diagnóstico del Error

## Error Actual
```
❌ Error: studentId must be a string
```

## Pruebas para Diagnosticar

### 1. Test Manual con cURL (Subir Reporte)

```bash
# Test 1: studentId como string en FormData
curl -X POST http://localhost:3001/uploads/reports \
  -F "file=@test.pdf" \
  -F "studentId=1"

# Test 2: studentId como string con comillas
curl -X POST http://localhost:3001/uploads/reports \
  -F "file=@test.pdf" \
  -F "studentId=\"1\""
```

### 2. Test Manual con cURL (Generar PEI)

```bash
# Test 1: studentId como string
curl -X POST http://localhost:3001/peis/generate \
  -H "Content-Type: application/json" \
  -d '{"reportId": 1, "studentId": "1"}'

# Test 2: studentId como número
curl -X POST http://localhost:3001/peis/generate \
  -H "Content-Type: application/json" \
  -d '{"reportId": 1, "studentId": 1}'
```

## Soluciones Aplicadas

### ✅ Cambio 1: neuroplanApi.ts
```typescript
uploadReport: (studentId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('studentId', String(studentId)); // ✅ Convertido a string
  return api.post(`/uploads/reports`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
```

### ✅ Cambio 2: api.ts (tipos)
```typescript
export interface GeneratePEIDTO {
  reportId: number;
  studentId?: number | string; // ✅ Acepta string
}
```

### ✅ Cambio 3: PEIEngine.tsx
```typescript
const generatePEI = async (reportId: number, studentId: number) => {
  const generateData: GeneratePEIDTO = { 
    reportId, 
    studentId: String(studentId) // ✅ Convertido a string
  };
  await peisService.generate(generateData);
}
```

## Posibles Causas del Error Persistente

### Causa 1: Backend requiere studentId en URL
Si el backend espera: `/uploads/reports/:studentId`

**Solución:**
```typescript
return api.post(`/uploads/reports/${studentId}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

### Causa 2: Backend requiere string explícito en JSON
Para `/peis/generate`:

**Verificar si el backend valida:**
```typescript
// Backend esperando:
class GeneratePEIDto {
  @IsString()
  studentId: string;
  
  @IsNumber()
  reportId: number;
}
```

### Causa 3: Validación de Clase en NestJS
El backend puede usar `class-validator` con:
```typescript
@IsString()
studentId: string;
```

## Debugging en el Frontend

### Console.log para verificar datos
```typescript
const generateData: GeneratePEIDTO = { 
  reportId, 
  studentId: String(studentId)
};
console.log('Sending PEI generation data:', generateData);
console.log('studentId type:', typeof generateData.studentId);
```

### Verificar FormData
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('studentId', String(studentId));

// Verificar contenido
for (let pair of formData.entries()) {
  console.log(pair[0], pair[1], typeof pair[1]);
}
```

## Próximos Pasos

1. ✅ Revisar logs del backend (puerto 3001)
2. ✅ Verificar estructura esperada por el backend
3. ✅ Probar con cURL directamente
4. ✅ Agregar console.logs para debugging
5. ✅ Revisar documentación del API del backend
