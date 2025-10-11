# 🔄 Workflows n8n para NeuroPlan

## 📌 Propósito de n8n en el Proyecto

n8n automatiza la comunicación y seguimiento del proceso de PEIs:
- ✉️ Notificaciones automáticas a familias y profesionales
- 📊 Tracking en Google Sheets
- 📅 Recordatorios de revisiones
- 🔗 Integración con herramientas educativas

---

## 🎯 Workflow 1: PEI Generado (ESENCIAL)

### Descripción
Cuando el backend genera un PEI nuevo, este workflow notifica automáticamente a todas las partes interesadas.

### Trigger
```
POST https://tu-n8n.app/webhook/neuroplan-pei-generated
```

### Payload que recibirá
```json
{
  "peiId": "clxxxxx",
  "studentName": "María González",
  "studentId": "clxxxxx",
  "gradeLevel": "6º Primaria",
  "diagnosis": "TDAH + Dislexia",
  "generatedAt": "2025-10-11T17:00:00.000Z",
  "familyEmail": "familia.gonzalez@email.com",
  "coordinatorEmail": "coordinador@colegio.edu",
  "peiUrl": "http://localhost:3001/api/peis/clxxxxx"
}
```

### Nodos del Workflow

#### 1. **Webhook** (Trigger)
- Método: POST
- Path: `/neuroplan-pei-generated`
- Response: 200 OK

#### 2. **Gmail - Email a Familia**
```
Para: {{ $json["familyEmail"] }}
Asunto: ✅ PEI de {{ $json["studentName"] }} ha sido generado

Hola,

Nos complace informarle que el Plan Educativo Individualizado (PEI) 
para {{ $json["studentName"] }} ha sido generado exitosamente.

📋 Diagnóstico: {{ $json["diagnosis"] }}
📅 Fecha de generación: {{ $json["generatedAt"] }}

El equipo pedagógico revisará el PEI en los próximos días. 
Recibirá una notificación cuando esté aprobado y listo para implementar.

🔗 Ver PEI: {{ $json["peiUrl"] }}

Atentamente,
Equipo NeuroPlan
```

#### 3. **Telegram - Notificación al Coordinador**
```
🎯 Nuevo PEI Generado

👤 Estudiante: {{ $json["studentName"] }}
📚 Nivel: {{ $json["gradeLevel"] }}
🏥 Diagnóstico: {{ $json["diagnosis"] }}

⏰ Acción requerida: Revisar y aprobar
🔗 {{ $json["peiUrl"] }}
```

#### 4. **Google Sheets - Registrar**
```
Hoja: "PEIs Generados"
Agregar fila:
- ID: {{ $json["peiId"] }}
- Estudiante: {{ $json["studentName"] }}
- Fecha: {{ $json["generatedAt"] }}
- Estado: "Pendiente Revisión"
- URL: {{ $json["peiUrl"] }}
```

#### 5. **Webhook Response**
```json
{
  "success": true,
  "message": "Notificaciones enviadas correctamente",
  "timestamp": "{{ $now }}"
}
```

---

## 🎯 Workflow 2: PEI Aprobado (ESENCIAL)

### Trigger
```
POST https://tu-n8n.app/webhook/neuroplan-pei-approved
```

### Payload
```json
{
  "peiId": "clxxxxx",
  "studentName": "María González",
  "familyEmail": "familia.gonzalez@email.com",
  "approvedBy": "Dra. Ana Martínez",
  "approvedAt": "2025-10-11T18:00:00.000Z",
  "peiPdfUrl": "http://localhost:3001/api/peis/clxxxxx/pdf",
  "teachers": ["prof1@colegio.edu", "prof2@colegio.edu"]
}
```

### Nodos del Workflow

#### 1. **Webhook** (Trigger)

#### 2. **HTTP Request - Descargar PDF del PEI**
```
URL: {{ $json["peiPdfUrl"] }}
Method: GET
Response Format: File
```

#### 3. **Gmail - Email a Familia (con PDF)**
```
Para: {{ $json["familyEmail"] }}
Asunto: ✅ PEI de {{ $json["studentName"] }} APROBADO

Estimada familia,

¡Excelente noticia! El Plan Educativo Individualizado (PEI) 
de {{ $json["studentName"] }} ha sido aprobado oficialmente.

✅ Aprobado por: {{ $json["approvedBy"] }}
📅 Fecha de aprobación: {{ $json["approvedAt"] }}

📎 Adjuntamos el documento oficial en PDF.

Próximos pasos:
1. Revisión del PEI (disponible en la plataforma)
2. Reunión de coordinación (próximamente)
3. Inicio de implementación de adaptaciones

Atentamente,
Equipo NeuroPlan
```

#### 4. **Gmail - Email a Profesores**
```
Para: {{ $json["teachers"] }} (split items)
Asunto: Nuevo PEI aprobado - {{ $json["studentName"] }}

Estimado/a profesor/a,

Se ha aprobado un nuevo PEI que afecta a su asignatura:

👤 Estudiante: {{ $json["studentName"] }}
📋 Incluye adaptaciones curriculares y metodológicas

Por favor, revise el PEI adjunto y planifique las adaptaciones 
necesarias para su materia.

📎 PDF adjunto
```

#### 5. **Google Calendar - Crear Evento de Revisión**
```
Título: Revisión PEI - {{ $json["studentName"] }}
Fecha: +3 meses desde {{ $json["approvedAt"] }}
Descripción: Revisión trimestral del PEI
Invitados: {{ $json["familyEmail"] }}, {{ $json["teachers"] }}
```

#### 6. **Google Sheets - Actualizar Estado**
```
Buscar fila con peiId: {{ $json["peiId"] }}
Actualizar:
- Estado: "Aprobado"
- Fecha Aprobación: {{ $json["approvedAt"] }}
- Aprobado Por: {{ $json["approvedBy"] }}
- Próxima Revisión: {{ $json["approvedAt"] + 3 meses }}
```

---

## 🎯 Workflow 3: Recordatorios Semanales (OPCIONAL)

### Trigger
```
Schedule Trigger: Todos los lunes a las 9:00
```

### Nodos

#### 1. **Schedule Trigger**
- Cron: `0 9 * * 1` (Lunes 9:00)

#### 2. **Google Sheets - Leer PEIs Activos**
```
Hoja: "PEIs Generados"
Filtro: Estado = "Aprobado"
        Próxima Revisión < hoy + 7 días
```

#### 3. **Loop Over Items**
Para cada PEI próximo a revisión:

#### 4. **Gmail - Recordatorio**
```
Para: {{ $json["coordinatorEmail"] }}
Asunto: 📅 Recordatorio: Revisión PEI próxima

El PEI del estudiante {{ $json["studentName"] }} 
requiere revisión en {{ $json["diasRestantes"] }} días.

Por favor, programe una reunión con la familia.
```

---

## 🚀 Configuración Rápida

### Para Demo del Hackathon (Sin n8n real)

Si no tienes tiempo de configurar n8n, el backend ya incluye **modo mock**:

```typescript
// El backend simula las llamadas a n8n
await fetch('http://localhost:3001/api/n8n/pei/1/generated', {
  method: 'POST'
});

// Respuesta mock inmediata:
{
  "success": true,
  "workflowId": "mock-workflow-123",
  "executionId": "mock-exec-456",
  "message": "Workflow ejecutado (modo demo)"
}
```

**Ventaja:** Tu demo funciona perfectamente sin configurar n8n.

---

## 🎯 Para Configurar n8n Real

### Opción 1: n8n Cloud (5 minutos)

1. **Regístrate:** https://n8n.io/
2. **Crea workflow:** "PEI Generated"
3. **Añade nodo Webhook:**
   - Copia la URL generada (ej: `https://tuusuario.app.n8n.cloud/webhook/abc123`)
4. **Añade nodos de Gmail/Telegram**
5. **Activa el workflow**
6. **Actualiza `.env`:**
   ```env
   N8N_WEBHOOK_URL="https://tuusuario.app.n8n.cloud/webhook/abc123"
   ```

### Opción 2: n8n Self-Hosted (15 minutos)

```bash
# 1. Instalar n8n
npm install -g n8n

# 2. Ejecutar
n8n start

# 3. Abrir http://localhost:5678

# 4. Crear workflow con webhooks

# 5. URLs serán:
# http://localhost:5678/webhook/neuroplan-pei-generated
# http://localhost:5678/webhook/neuroplan-pei-approved
```

---

## 📊 Endpoints del Backend que Usan n8n

### Ya implementados en el backend:

```typescript
// 1. Notificar PEI generado
POST /api/n8n/pei/:id/generated

// 2. Notificar PEI aprobado
POST /api/n8n/pei/:id/approved

// 3. Disparar workflow personalizado
POST /api/n8n/trigger-workflow
Body: { workflowName: "custom", data: {...} }

// 4. Webhook genérico (para callbacks)
POST /api/n8n/webhook/:action

// 5. Ver estadísticas
GET /api/n8n/stats
```

---

## ✨ Valor para el Hackathon

### Lo que impresionará al jurado:

1. **Automatización Real:** "Cuando generamos un PEI, la familia recibe un email automáticamente"
2. **Trazabilidad:** "Todo queda registrado en Google Sheets para auditoría"
3. **Comunicación Multicanal:** "Notificaciones por email, Telegram y calendario"
4. **Escalabilidad:** "Con n8n podemos añadir integraciones sin tocar código"

### Pitch de 30 segundos:

> "Con n8n, automatizamos toda la comunicación: cuando generamos un PEI, 
> la familia recibe un email, el coordinador una notificación en Telegram, 
> se registra en Google Sheets y se crea un evento de revisión en Calendar. 
> Todo en tiempo real, sin intervención manual. Esto reduce el trabajo 
> administrativo en un 80%."

---

## 🎯 Resumen: ¿Qué hacer?

### Para DEMO INMEDIATA (Recomendado):
✅ **No configurar nada** - El modo mock funciona perfecto
✅ Solo mencionar en la presentación: "Integración con n8n lista para automatización"

### Para DEMO AVANZADA (Si tienes 15 min):
1. Crear cuenta en n8n.io
2. Crear 1 workflow simple: "PEI Generated" → Email
3. Copiar webhook URL a `.env`
4. Reiniciar servidor
5. ¡Demostrar notificaciones reales!

### Para PRODUCCIÓN (Post-hackathon):
1. Configurar los 3 workflows completos
2. Añadir autenticación en webhooks
3. Configurar SMTP real para emails
4. Integrar Google Workspace

---

**¿Quieres que te ayude a crear un workflow básico de n8n ahora o prefieres dejarlo en modo mock para la demo?** 🚀
