# 🚀 GUÍA COMPLETA DE USO - NEUROPLAN FRONTEND

## Fecha: 12 de octubre de 2025

---

## 📋 ÍNDICE

1. [Funcionalidades Principales](#funcionalidades-principales)
2. [Cómo Subir Informe Médico](#cómo-subir-informe-médico)
3. [Generar PEI con IA](#generar-pei-con-ia)
4. [AWS Bedrock - IA Generativa](#aws-bedrock---ia-generativa)
5. [N8N Workflows](#n8n-workflows)
6. [Audio con ElevenLabs](#audio-con-elevenlabs)
7. [Sistema de Accesibilidad](#sistema-de-accesibilidad)

---

## 🎯 FUNCIONALIDADES PRINCIPALES

### ✅ Lo que puedes hacer desde el frontend:

1. **Gestión de Estudiantes**
   - Crear perfil de estudiante
   - Subir reportes médicos (PDF, Word, Imágenes)
   - Ver lista de estudiantes

2. **Generación de PEI (Plan Educativo Individualizado)**
   - Generar PEI automático desde reporte médico
   - Editar y actualizar PEI
   - Descargar PEI como PDF

3. **IA Generativa (AWS Bedrock)**
   - Simplificar contenido educativo
   - Generar PEI con Claude/Llama
   - Crear planes de lección adaptados

4. **Audio (ElevenLabs)**
   - Convertir texto a audio
   - Narrar PEI completo
   - Generar resúmenes en audio

5. **Workflows (N8N)**
   - Automatizar notificaciones
   - Enviar reportes por email
   - Ejecutar integraciones

6. **Accesibilidad**
   - 29+ herramientas
   - 6 perfiles predefinidos
   - 6 filtros de daltonismo

---

## 📄 CÓMO SUBIR INFORME MÉDICO

### Paso a Paso:

#### 1. **Ir a PEI Engine**
```
URL: http://localhost:8080/pei-engine
```

#### 2. **Crear Estudiante (si no existe)**

1. Click en tab **"Crear Estudiante"**
2. Llenar el formulario:
   ```
   Nombre: Ana Pérez
   Edad: 10 años
   Grado: 5° Primaria
   Diagnóstico: Dislexia
   ```

#### 3. **Subir Reporte Médico**

1. En la sección **"Subir Reporte Médico"**
2. Click en **"Seleccionar archivo"**
3. Formatos aceptados:
   - ✅ PDF (`.pdf`)
   - ✅ Word (`.doc`, `.docx`)
   - ✅ Imágenes (`.jpg`, `.jpeg`, `.png`)
   - ✅ Texto (`.txt`)

4. Ejemplo de archivo:
   ```
   Nombre: informe_medico_ana.pdf
   
   Contenido típico:
   - Diagnóstico: Dislexia severa
   - Síntomas: Dificultad de lectura, inversión de letras
   - Recomendaciones: Apoyo visual, más tiempo en exámenes
   - Medicación: Ninguna
   - Observaciones: Alta motivación, apoyo familiar
   ```

5. Click en **"Subir Reporte"**

6. ✅ Verás confirmación: "Reporte subido exitosamente"

---

## 🧠 GENERAR PEI CON IA

### Método 1: Desde Reporte Médico (Automático)

#### Paso a Paso:

1. **Tener estudiante con reporte subido** (paso anterior)

2. **Ir a tab "Generar PEI"**

3. **Seleccionar estudiante** de la lista desplegable

4. **Click en "Generar PEI con IA"**

5. **Esperar análisis** (muestra barra de progreso):
   - 📄 Extrayendo texto del reporte...
   - 🧠 Analizando con IA...
   - ✍️ Generando recomendaciones...
   - ✅ PEI generado!

6. **Ver resultado**:
   ```
   PEI para: Ana Pérez
   Diagnóstico: Dislexia
   
   Adaptaciones curriculares:
   - Uso de fuente OpenDyslexic
   - Tiempo extra en evaluaciones (50%)
   - Material visual de apoyo
   
   Metodología:
   - Lectura en voz alta
   - Uso de audiolibros
   - Resúmenes visuales
   
   Evaluación:
   - Evaluaciones orales permitidas
   - Formato de examen adaptado
   ```

7. **Acciones disponibles**:
   - 📥 **Descargar PDF**: Genera documento profesional
   - 🎙️ **Generar Audio**: Narra el PEI completo
   - ✏️ **Editar**: Modificar secciones
   - 📤 **Compartir**: Enviar por email (workflow)

---

### Método 2: Generar PEI desde Cero (Sin Reporte)

#### Paso a Paso:

1. **Ir a tab "AWS Bedrock"** o **"Generar PEI Manual"**

2. **Llenar formulario**:
   ```
   Nombre del estudiante: Ana Pérez
   Nivel educativo: 5° Primaria
   Diagnóstico: Dislexia
   Síntomas: Dificultad de lectura, inversión de letras
   Fortalezas: Alta motivación, apoyo familiar
   ```

3. **Seleccionar modelo de IA**:
   - Claude 3 Sonnet (recomendado)
   - Llama 3
   - Titan

4. **Click en "Generar PEI"**

5. **Ver resultado generado por IA**

---

## 🤖 AWS BEDROCK - IA GENERATIVA

### ¿Qué es AWS Bedrock?
Servicio de AWS que da acceso a modelos de IA como Claude, Llama, Titan para generar texto inteligente.

### Funcionalidades Disponibles:

---

#### 1. **SIMPLIFICAR CONTENIDO EDUCATIVO**

**URL**: `http://localhost:8080/bedrock-demo`

**Uso**:
1. Tab **"Simplificar Contenido"**
2. Escribir texto complejo:
   ```
   Texto original:
   "El proceso de fotosíntesis es un mecanismo bioquímico mediante 
   el cual las plantas convierten la energía lumínica en energía 
   química almacenada en moléculas de glucosa."
   ```

3. Seleccionar nivel objetivo:
   - **Elementary**: Para niños 6-10 años
   - **Middle School**: Para adolescentes 11-14 años
   - **High School**: Para jóvenes 15-18 años

4. Click **"Simplificar Contenido"**

5. Resultado:
   ```
   Texto simplificado (Elementary):
   "Las plantas usan la luz del sol para hacer su propia comida. 
   Esto se llama fotosíntesis. La luz se convierte en azúcar 
   que la planta puede usar para crecer."
   ```

**¿Cuándo usar?**
- Adaptar libros de texto
- Simplificar instrucciones
- Crear material para diferentes niveles
- Hacer contenido más accesible

---

#### 2. **GENERAR PEI COMPLETO**

**URL**: `http://localhost:8080/bedrock-demo`

**Uso**:
1. Tab **"Generar PEI"**
2. Llenar datos:
   ```
   Nombre: Ana Pérez
   Grado: 5° Primaria
   Diagnóstico: Dislexia, TDAH
   Síntomas: 
     - Dificultad de lectura
     - Problemas de concentración
     - Inversión de letras
   Fortalezas:
     - Muy creativa
     - Buena en matemáticas
     - Apoyo familiar fuerte
   ```

3. Click **"Generar PEI con IA"**

4. Resultado: PEI completo con:
   - Objetivos específicos
   - Adaptaciones curriculares
   - Estrategias metodológicas
   - Criterios de evaluación
   - Recursos recomendados
   - Plan de seguimiento

**Ventajas**:
- ✅ Generado en segundos
- ✅ Personalizado al estudiante
- ✅ Basado en mejores prácticas
- ✅ Alineado con LOMLOE

---

#### 3. **GENERAR PLAN DE LECCIÓN ADAPTADO**

**URL**: `http://localhost:8080/bedrock-demo`

**Uso**:
1. Tab **"Plan de Lección"**
2. Especificar:
   ```
   Asignatura: Matemáticas
   Tema: Fracciones
   Grado: 4° Primaria
   Duración: 45 minutos
   Adaptaciones necesarias:
     - Material visual
     - Tiempo extra
     - Ejemplos concretos
   ```

3. Click **"Generar Plan de Lección"**

4. Resultado:
   ```
   PLAN DE LECCIÓN: Fracciones
   
   Objetivos:
   - Comprender el concepto de fracción
   - Identificar numerador y denominador
   - Comparar fracciones simples
   
   Materiales:
   - Fichas de colores
   - Pizzas de papel
   - Tarjetas visuales
   
   Actividades:
   1. Introducción (10 min):
      - Partir pizzas de papel
      - Mostrar fracciones reales
   
   2. Práctica guiada (20 min):
      - Ejercicios con fichas
      - Trabajo en parejas
   
   3. Evaluación (15 min):
      - Preguntas orales
      - Ejercicio visual
   
   Adaptaciones para dislexia:
   - Usar colores diferentes
   - Permitir respuestas orales
   - Dar tiempo extra
   ```

---

#### 4. **LISTAR MODELOS DISPONIBLES**

**Uso**:
1. Tab **"Modelos"**
2. Click **"Cargar Modelos"**
3. Ver lista:
   ```
   ✅ Claude 3 Sonnet (recomendado para PEI)
   ✅ Claude 3 Haiku (rápido)
   ✅ Llama 3 70B
   ✅ Titan Text
   ```

---

## 🔄 N8N WORKFLOWS

### ¿Qué es N8N?
Herramienta de automatización que conecta servicios y ejecuta tareas automáticas.

### Workflows Disponibles:

---

#### 1. **ENVIAR REPORTE POR EMAIL**

**URL**: `http://localhost:8080/workflow-demo`

**Uso**:
1. Seleccionar workflow: **"Enviar Reporte"**
2. Llenar datos:
   ```
   Email destinatario: padre@example.com
   Estudiante: Ana Pérez
   Tipo de reporte: PEI
   Mensaje: "Adjunto PEI actualizado de Ana"
   ```

3. Click **"Ejecutar Workflow"**

4. Resultado:
   - ✅ Email enviado
   - ✅ PDF adjunto
   - ✅ Registro en historial

---

#### 2. **NOTIFICACIÓN DE SEGUIMIENTO**

**Uso**:
1. Workflow: **"Recordatorio de Seguimiento"**
2. Configurar:
   ```
   Estudiante: Ana Pérez
   Frecuencia: Mensual
   Destinatarios: 
     - Profesor
     - Padre/Madre
     - Psicopedagogo
   ```

3. Ejecutar

4. Resultado:
   - 📧 Email automático cada mes
   - 📊 Con progreso del estudiante
   - 📝 Checklist de objetivos

---

#### 3. **INTEGRACIÓN CON CALENDARIO**

**Uso**:
1. Workflow: **"Crear Eventos"**
2. Datos:
   ```
   Tipo: Evaluación de seguimiento
   Fecha: 15/11/2025
   Asistentes: Equipo educativo
   ```

3. Ejecutar

4. Resultado:
   - ✅ Evento en Google Calendar
   - ✅ Invitaciones enviadas
   - ✅ Recordatorios automáticos

---

## 🎙️ AUDIO CON ELEVENLABS

### ¿Qué es ElevenLabs?
Servicio de IA que convierte texto a audio con voces naturales.

### Funcionalidades:

---

#### 1. **CONVERTIR TEXTO A AUDIO**

**Desde**: PEI Engine o cualquier página

**Uso**:
1. Seleccionar texto
2. Click **"Convertir a Audio"**
3. Elegir voz:
   - 🗣️ Voz masculina
   - 🗣️ Voz femenina
   - 🗣️ Voz infantil

4. Reproducir audio generado

**Ejemplo**:
```
Texto: "Los objetivos de este trimestre son..."
Audio: [Voz natural leyendo el texto]
```

---

#### 2. **GENERAR AUDIO DE PEI COMPLETO**

**Desde**: Vista de PEI

**Uso**:
1. Abrir PEI generado
2. Click **"🎙️ Generar Audio del PEI"**
3. Esperar generación (30-60 segundos)
4. Reproducir o descargar MP3

**Resultado**:
- 🎧 Audio completo del PEI
- 📥 Descargable como MP3
- ⏱️ Duración: 5-10 minutos aprox.

**Uso práctico**:
- Padres pueden escuchar el PEI
- Accesible para personas con discapacidad visual
- Revisar PEI mientras conduces

---

#### 3. **GENERAR RESUMEN EN AUDIO**

**Uso**:
1. Click **"Resumen en Audio"**
2. IA genera resumen ejecutivo
3. Convierte a audio
4. Audio corto (1-2 minutos)

**Ejemplo de resumen**:
```
"Ana Pérez, estudiante de 5° Primaria con dislexia. 
Requiere material visual, tiempo extra y fuente adaptada. 
Objetivos principales: mejorar velocidad lectora y comprensión. 
Evaluación mediante exámenes orales."
```

---

## ♿ SISTEMA DE ACCESIBILIDAD

### Cómo Activar:

1. **Click en botón flotante** (arriba derecha)
2. **Seleccionar herramientas** que necesites
3. **Aplicar perfil** predefinido (opcional)

### Herramientas Disponibles:

#### 📍 **Navegación**
- ⚫ Cursor Negro (grande)
- ⚪ Cursor Blanco (grande)
- 📏 Guía de Lectura (línea roja)
- 🔍 Lupa (agranda elementos al hover)

#### 📝 **Texto**
- 🔤 Tamaño de fuente (50-200%)
- 📊 Espaciado de letras
- 📏 Altura de línea
- 📐 Espaciado de palabras
- 🅰️ Fuente para dislexia
- 📖 Fuente legible
- ⬅️ Alineación (izquierda/centro/derecha/justificada)

#### 🎨 **Visual**
- 🌟 Alto Contraste
- 🌙 Contraste Oscuro
- ☀️ Contraste Claro
- 🔄 Invertir Colores
- ⚫ Monocromo
- 🎨 Alta Saturación
- 🌫️ Baja Saturación

#### 💡 **Brillo**
- ☀️ Brillo Alto
- 🌙 Brillo Bajo

#### 🎯 **Enfoque**
- 🎯 Modo Enfoque (difumina lo no seleccionado)
- 🚫 Bloquear Animaciones
- 🖼️ Ocultar Imágenes
- 🔗 Resaltar Enlaces
- 📰 Resaltar Títulos

#### 👁️ **Daltonismo** (6 filtros)
- Deuteranopia
- Deuteranomalía
- Protanopia
- Tritanopia
- Tritanomalía
- Acromatopsia

### Perfiles Predefinidos:

1. **Epilepsia**: Bloquea animaciones, baja saturación
2. **Aprendizaje**: Fuente grande, guía de lectura
3. **Discapacidad Visual**: Fuente XL, alto contraste
4. **Mayores**: Fuente grande, espaciado amplio
5. **TDAH**: Modo enfoque, sin animaciones
6. **Dislexia**: Fuente especial, guía de lectura

---

## 🧪 FLUJO COMPLETO DE TRABAJO

### Ejemplo Real: Crear PEI para Ana

#### 1. **Crear Estudiante**
```
Ir a: /pei-engine
Tab: Crear Estudiante
Datos: Ana Pérez, 10 años, 5° Primaria
```

#### 2. **Subir Reporte Médico**
```
Archivo: informe_medico_ana.pdf
Contenido: Diagnóstico de dislexia
```

#### 3. **Generar PEI con IA**
```
Click: "Generar PEI con IA"
Esperar: Análisis automático
Resultado: PEI completo generado
```

#### 4. **Simplificar Material Educativo**
```
Ir a: /bedrock-demo
Tab: Simplificar Contenido
Texto: Lección de ciencias naturales
Nivel: Elementary
Resultado: Texto adaptado para Ana
```

#### 5. **Generar Audio del PEI**
```
Click: "Generar Audio"
Esperar: 30 segundos
Resultado: MP3 del PEI narrado
```

#### 6. **Enviar a Padres**
```
Ir a: /workflow-demo
Workflow: "Enviar Reporte"
Email: padres_ana@example.com
Adjuntar: PEI en PDF + Audio
Ejecutar
```

#### 7. **Programar Seguimiento**
```
Workflow: "Recordatorio Mensual"
Frecuencia: Cada 30 días
Destinatarios: Equipo educativo
```

---

## 📊 RESUMEN DE RUTAS

| Funcionalidad | URL | Descripción |
|---------------|-----|-------------|
| **Home** | `/` | Página principal |
| **Login** | `/login` | Inicio de sesión |
| **Dashboard** | `/dashboard` | Panel principal |
| **PEI Engine** | `/pei-engine` | ⭐ Gestión de PEIs |
| **Bedrock Demo** | `/bedrock-demo` | ⭐ IA Generativa |
| **Workflow Demo** | `/workflow-demo` | ⭐ N8N Workflows |
| **Recursos** | `/recursos` | Recursos educativos |

---

## ⚡ COMANDOS RÁPIDOS

### Backend debe estar corriendo:
```bash
# Puerto 3001
cd neuroplan-backend
npm run start:dev
```

### Frontend:
```bash
# Puerto 8080
cd neuroplan-frontend
npm run dev
```

### Limpiar caché:
```javascript
// En consola del navegador (F12)
localStorage.clear();
location.reload();
```

---

## 🎯 CHECKLIST DE TESTING

### ✅ Subir Informe Médico
- [ ] Crear estudiante
- [ ] Subir PDF
- [ ] Ver confirmación

### ✅ Generar PEI
- [ ] Seleccionar estudiante
- [ ] Click "Generar PEI"
- [ ] Ver PEI generado
- [ ] Descargar PDF

### ✅ AWS Bedrock
- [ ] Simplificar texto
- [ ] Generar PEI desde formulario
- [ ] Crear plan de lección

### ✅ Audio
- [ ] Generar audio de PEI
- [ ] Reproducir
- [ ] Descargar MP3

### ✅ Workflows
- [ ] Ejecutar workflow
- [ ] Ver historial
- [ ] Verificar ejecución

### ✅ Accesibilidad
- [ ] Activar lupa
- [ ] Probar filtros
- [ ] Aplicar perfil
- [ ] Verificar reset al recargar

---

## 🔑 CREDENCIALES DE PRUEBA

```
Usuario: test@neuroplan.com
Contraseña: Test123!

O registrarte en: /registro
```

---

## 📞 SOPORTE

Si algo no funciona:

1. **Verificar Backend**: ¿Está corriendo en puerto 3001?
2. **Ver Consola**: F12 → Console (buscar errores)
3. **Limpiar Caché**: `localStorage.clear()`
4. **Recargar**: Ctrl + F5

---

**Estado**: ✅ LISTO PARA USAR
**Última Actualización**: 12 octubre 2025
**Puerto Frontend**: http://localhost:8080/
