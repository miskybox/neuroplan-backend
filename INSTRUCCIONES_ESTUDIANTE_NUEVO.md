# ✅ FLUJO COMPLETO: NUEVO ESTUDIANTE + INFORME PDF

## 🎯 NUEVA FUNCIONALIDAD

Ahora puedes **crear un estudiante nuevo** directamente desde el formulario y subirle el informe en un solo flujo.

---

## 🚀 CÓMO USAR

### **Abrir la página:**
```
http://localhost:3001/upload
```

### **Opción 1: Estudiante NUEVO (no registrado)**

1. **Marcar el checkbox:** ✅ "➕ Crear nuevo estudiante"
2. **Rellenar datos del estudiante:**
   - Nombre: `María`
   - Apellidos: `González Pérez`
   - Fecha de Nacimiento: `2012-05-15`
   - Curso: `6º Primaria`
   - Email de contacto: `familia.gonzalez@email.com`
3. **Seleccionar archivo PDF**
4. **Click en "🚀 Subir y Generar PEI"**

---

### **Opción 2: Estudiante EXISTENTE**

1. **Dejar el checkbox sin marcar**
2. **Seleccionar estudiante** del dropdown
3. **Seleccionar archivo PDF**
4. **Click en "🚀 Subir y Generar PEI"**

---

## 📄 FORMATOS DE ARCHIVO SOPORTADOS

- ✅ **PDF** (.pdf) - Recomendado
- ✅ **Word** (.doc, .docx)
- ✅ **Imágenes** (.jpg, .jpeg, .png)
- ✅ **Texto** (.txt) - Para pruebas rápidas

**Tamaño máximo:** 10MB

---

## 🔄 FLUJO COMPLETO

```
1. ➕ Crear estudiante (si es nuevo)
   └─ POST /api/uploads/students
      └─ Retorna studentId

2. 📤 Subir informe PDF
   └─ POST /api/uploads/reports/:studentId
      └─ Guarda archivo en disco
      └─ Retorna reportId

3. 🤖 Generar PEI con Claude AI
   └─ POST /api/peis/generate
      └─ Extrae texto del PDF
      └─ Analiza con Claude AI
      └─ Genera objetivos, adaptaciones, estrategias
      └─ Retorna PEI completo

4. 📧 Notificar via n8n
   └─ POST /api/n8n/pei/:id/generated
      └─ Email a familia
      └─ Notificación a coordinador
      └─ Registra en Google Sheets
```

---

## 🧪 EJEMPLO DE PRUEBA RÁPIDA

### 1. Crear archivo de prueba:

```bash
# Crear un archivo de texto simple
echo Informe Psicopedagogico. Estudiante: Maria Gonzalez. Diagnostico: Dislexia moderada. Sintomas: Dificultades en lectura y escritura. Fortalezas: Excelente comprension oral y creatividad. > C:\Users\misky\Desktop\informe-maria.txt
```

### 2. En el navegador:

1. Ir a: `http://localhost:3001/upload`
2. ✅ Marcar "Crear nuevo estudiante"
3. Rellenar:
   - Nombre: `María`
   - Apellidos: `González Pérez`
   - Fecha: `2012-05-15`
   - Curso: `6º Primaria`
   - Email: `familia.gonzalez@email.com`
4. Seleccionar: `informe-maria.txt`
5. Click: **"🚀 Subir y Generar PEI"**
6. Esperar 30-40 segundos
7. ✅ Ver PEI generado

---

## 📊 LO QUE VERÁS

### Durante el proceso:

```
⏳ Subiendo archivo...
📄 Extrayendo texto del documento...
🤖 Analizando con Claude AI...
📋 Generando objetivos y adaptaciones...
📧 Enviando notificaciones...
```

### Al finalizar:

```
✅ ¡PEI Generado Exitosamente!

ID del PEI: clxxxxx
Estudiante: María González Pérez
Estado: DRAFT
Versión: 1

📧 La familia ha recibido un email con el resumen del PEI
📱 El coordinador ha sido notificado
📅 Revisión programada en 3 meses
```

---

## 🎯 PARA LA DEMO DEL HACKATHON

### Script de demostración:

```
"Voy a demostrar cómo NeuroPlan procesa un informe 
completo de un estudiante que no está en el sistema.

[MOSTRAR FORMULARIO]

"Primero, marco 'Crear nuevo estudiante' y completo 
sus datos: María González, 6º Primaria."

[RELLENAR DATOS]

"Ahora subo el informe psicopedagógico en PDF."

[SUBIR ARCHIVO]

"Con un click, NeuroPlan:
1. Registra al estudiante
2. Sube el informe
3. Extrae el texto automáticamente
4. Lo analiza con Claude AI
5. Genera el PEI personalizado completo
6. Notifica a la familia y coordinador"

[VER PROGRESO EN TIEMPO REAL]

"Todo esto en 30 segundos vs 6 semanas manual.
Y el PEI ya está listo: objetivos SMART, adaptaciones
por asignatura, estrategias, evaluación, seguimiento."

[MOSTRAR RESULTADO]

"La familia ya recibió el email. El coordinador fue 
notificado. Todo quedó registrado para auditoría."
```

---

## 🔧 TROUBLESHOOTING

### ❌ "No se puede conectar al backend"
```bash
# Verificar que está corriendo
curl http://localhost:3001/health

# Si no responde, reiniciar:
start "NeuroPlan Backend" cmd /k "cd /d C:\Users\misky\Desktop\neuroplan-hackathon\neuroplan-backend && node -r ts-node/register -r tsconfig-paths/register src/main.ts"
```

### ❌ "Error creando estudiante"
- Verificar que todos los campos están completos
- Email debe ser válido
- Fecha de nacimiento en formato YYYY-MM-DD

### ❌ "Error subiendo archivo"
- Verificar tamaño < 10MB
- Verificar formato válido (PDF, DOC, JPG, PNG, TXT)

### ❌ "Error generando PEI"
- Ver logs del backend en la ventana cmd
- Verificar que el archivo tiene contenido
- Si es imagen, verificar que es legible

---

## 📚 ENDPOINTS UTILIZADOS

| Endpoint | Descripción |
|----------|-------------|
| `POST /api/uploads/students` | ⭐ Crear estudiante |
| `POST /api/uploads/reports/:id` | ⭐ Subir informe |
| `POST /api/peis/generate` | ⭐ Generar PEI |
| `POST /api/n8n/pei/:id/generated` | ⭐ Notificar |

---

## ✅ RESUMEN

**LO QUE FUNCIONA AHORA:**

1. ✅ Crear estudiante nuevo desde el formulario
2. ✅ O seleccionar estudiante existente
3. ✅ Subir informe PDF/Word/Imagen
4. ✅ Generar PEI completo con Claude AI
5. ✅ Notificaciones automáticas via n8n
6. ✅ Todo en un solo flujo sin interrupciones

---

**¡LISTO PARA LA DEMO! 🚀**

**URL:** `http://localhost:3001/upload`

---

*Última actualización: 12 Oct 2025 - NeuroPlan con estudiantes nuevos*
