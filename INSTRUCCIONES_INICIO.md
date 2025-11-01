# 🚀 INSTRUCCIONES DE INICIO RÁPIDO

## Iniciar Todo el Proyecto

### Opción 1: Script Automático (Recomendado)

```bash
# Iniciar todo (backend + frontend)
start-dev.bat

# Detener todo
stop-all.bat

# Solo Ollama
start-ollama.bat
```

### Opción 2: Manual

#### 1. Iniciar Ollama
```bash
start-ollama.bat
```
O manualmente:
```bash
start "Ollama Service" "C:\Users\%USERNAME%\AppData\Local\Programs\Ollama\ollama.exe" serve
```

Verificar que esté corriendo:
```bash
curl http://localhost:11434/api/tags
```

#### 2. Iniciar Backend
```bash
cd backend
npm run build
npm run start:dev
```

Backend disponible en: **http://localhost:3001/api**

#### 3. Iniciar Frontend (en otra terminal)
```bash
cd frontend
npm run dev
```

Frontend disponible en: **http://localhost:5173**

---

## Verificar que Todo Funciona

### 1. Ollama
- ✅ Puerto 11434 escuchando
- ✅ Modelo `llama3.2:3b` instalado

**Verificar:**
```bash
curl http://localhost:11434/api/tags
```

Si falta el modelo:
```bash
ollama pull llama3.2:3b
```

### 2. Backend
- ✅ Puerto 3001 escuchando
- ✅ API disponible en `/api`

**Verificar:**
```bash
curl http://localhost:3001/api/uploads/test
```

### 3. Frontend
- ✅ Puerto 5173 escuchando
- ✅ Interfaz accesible

**Verificar:**
Abrir http://localhost:5173 en el navegador

---

## Orden de Inicio Recomendado

1. **Ollama** (servicio de IA)
2. **Backend** (API)
3. **Frontend** (interfaz)

---

## Solución de Problemas

### Ollama no inicia
```bash
# Verificar si está instalado
where ollama

# Intentar iniciar manualmente
"C:\Users\%USERNAME%\AppData\Local\Programs\Ollama\ollama.exe" serve
```

### Puerto 3001 ocupado
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr ":3001"

# Matar proceso (reemplaza PID con el número)
taskkill /F /PID [PID]
```

### Puerto 5173 ocupado
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr ":5173"

# Matar proceso
taskkill /F /PID [PID]
```

### Detener todo
```bash
# Matar todos los procesos Node.js
taskkill /F /IM node.exe

# Detener Ollama (cerrar la ventana del servicio)
```

---

## URLs Importantes

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api
- **Ollama API:** http://localhost:11434
- **Health Check:** http://localhost:3001/api/health
- **Swagger Docs:** http://localhost:3001/api/docs (si está configurado)

---

## Estado Actual

✅ **Ollama:** Corriendo en puerto 11434
✅ **Modelos instalados:** llama3.2:3b, gemma3:12b
✅ **Backend:** Iniciado en puerto 3001
✅ **Frontend:** Iniciado en puerto 5173

---

**Última actualización:** ${new Date().toLocaleDateString('es-ES')}



