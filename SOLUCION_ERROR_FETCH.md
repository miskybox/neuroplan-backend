# 🚨 SOLUCIÓN RÁPIDA: Error "Failed to fetch"

## ❌ PROBLEMA
El frontend muestra "Failed to fetch" porque el backend NO está corriendo.

## ✅ SOLUCIÓN (2 MINUTOS)

### 1️⃣ Abrir una terminal NUEVA (cmd):

```
Win + R → escribir "cmd" → Enter
```

### 2️⃣ Ir a la carpeta del backend:

```bash
cd C:\Users\misky\Desktop\neuroplan-hackathon\neuroplan-backend
```

### 3️⃣ Iniciar el backend:

```bash
node -r ts-node/register -r tsconfig-paths/register src/main.ts
```

### 4️⃣ Esperar a ver este mensaje:

```
🚀 NeuroPlan Backend iniciado correctamente!
🌐 Servidor: http://localhost:3001
```

### 5️⃣ **NO CERRAR ESA VENTANA** - Dejarla abierta

### 6️⃣ Ahora SÍ abrir el HTML en el navegador:

```
- Ir a C:\Users\misky\Desktop\neuroplan-hackathon\neuroplan-backend
- Doble click en upload.html
- O arrastrarlo al navegador
```

### 7️⃣ Probar el flujo:
1. Seleccionar estudiante
2. Seleccionar archivo
3. Click en "Subir y Generar PEI"

---

## 🔍 VERIFICAR QUE EL BACKEND ESTÁ CORRIENDO

Abrir otra terminal y ejecutar:

```bash
curl http://localhost:3001/health
```

**Debe responder:**
```json
{"status":"healthy","database":"connected"}
```

---

## ⚠️ SI SIGUE FALLANDO

### Opción A: Probar con Postman/Insomnia

1. Abrir Postman
2. Crear request POST:
   - URL: `http://localhost:3001/api/uploads/reports/cmgmtmx5m0000tbr67zc8hg9m`
   - Body: Form-data
   - Key: `file` (tipo File)
   - Value: Seleccionar tu PDF
3. Send

### Opción B: Usar curl desde cmd

```bash
curl -X POST http://localhost:3001/api/uploads/reports/cmgmtmx5m0000tbr67zc8hg9m -F "file=@C:\Users\misky\Desktop\test.pdf"
```

---

## 🎯 RESUMEN

**El problema es simple:** El backend no está corriendo.

**La solución es simple:** 
1. Abrir cmd
2. Ir a la carpeta
3. Ejecutar `node -r ts-node/register -r tsconfig-paths/register src/main.ts`
4. Dejar esa ventana abierta
5. Ahora sí usar el frontend

---

## 📝 NOTA IMPORTANTE

**NO uses `Ctrl+C` en la ventana del backend** o se detendrá el servidor.

Para detenerlo correctamente:
- Ctrl+C una vez
- Esperar a que se detenga
- Cerrar la ventana

Para reiniciarlo:
- Volver a ejecutar el comando
- Esperar el mensaje de inicio

---

**¿Necesitas más ayuda?** Avísame qué error específico ves en la consola del navegador (F12).
