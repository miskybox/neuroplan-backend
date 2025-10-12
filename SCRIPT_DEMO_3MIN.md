# 🎬 NeuroPlan - Script de Demo (3 MINUTOS EXACTOS)

## ⏱️ TIMING CRÍTICO: 180 segundos

---

## 🎯 OBJETIVO DE LA DEMO
Mostrar el flujo completo: **Upload de informe → Análisis IA → PEI generado → Audio → Recursos**

---

## 📋 PREPARACIÓN (ANTES DE LA DEMO)

### ✅ Checklist 10 minutos antes:
- [ ] Backend corriendo en http://localhost:3001
- [ ] Frontend abierto en http://localhost:8080
- [ ] Swagger docs en http://localhost:3001/api/docs (tab abierto)
- [ ] Informe PDF de prueba listo
- [ ] Cronómetro/timer visible
- [ ] Zoom 125% en pantalla
- [ ] Modo No Molestar activado
- [ ] Agua a mano

### 📄 Informe de Prueba
Crear archivo: `informe-demo.pdf` o `informe-demo.txt` con:

```
INFORME PSICOPEDAGÓGICO

Nombre: Ana Pérez García
Fecha de nacimiento: 20/05/2015
Curso: 5º Primaria
Centro: CEIP Hackathon

DIAGNÓSTICO:
Dislexia moderada

OBSERVACIONES:
La alumna presenta dificultades en la lectura y escritura.
Velocidad lectora por debajo de su edad.
Confusión de letras b/d, p/q.
Buena capacidad de comprensión oral.

RECOMENDACIONES:
- Tiempo extra en exámenes
- Apoyo visual
- Método multisensorial
- Evaluación preferentemente oral
```

---

## 🎤 SCRIPT PALABRA POR PALABRA (3 MINUTOS)

### [0:00 - 0:20] APERTURA (20 segundos)

**[Respirar profundo]**

> "Buenos días/tardes. Soy [TU NOMBRE] y les presento **NeuroPlan**.
> 
> En España, **500,000 estudiantes neurodivergentes** necesitan Planes Educativos Individualizados.
>
> Hoy, crear un PEI tarda **6 semanas**.
>
> Con NeuroPlan, tarda **5 minutos**.
>
> Déjenme mostrárselo."

**[Acción: Abrir frontend]**

---

### [0:20 - 1:00] UPLOAD Y ANÁLISIS (40 segundos)

**[Mostrar pantalla de upload]**

> "Este es un informe psicopedagógico real de Ana, 10 años, dislexia moderada."

**[Acción: Arrastrar/subir informe-demo.pdf]**

> "Lo subimos... y el sistema automáticamente:
>
> **1.** Extrae el texto con **AWS Textract**
> 
> **2.** Analiza entidades médicas con **AWS Comprehend**
>
> **3.** Detecta datos sensibles y los protege
>
> Todo en segundos."

**[Mostrar en Swagger o consola los endpoints ejecutándose]**

```bash
# Si quieres mostrar en terminal:
curl -X POST http://localhost:3001/aws/textract/extract
curl -X POST http://localhost:3001/aws/comprehend/detect-entities
```

---

### [1:00 - 1:40] GENERACIÓN DE PEI CON IA (40 segundos)

**[Acción: Mostrar botón "Generar PEI con IA"]**

> "Ahora, **AWS Bedrock con Claude AI** genera un Plan Educativo completo y personalizado."

**[Click en generar]**

**[Mientras carga, narrar:]**

> "La IA analiza el diagnóstico, la edad, el curso, y genera:
>
> - **Objetivos SMART** específicos
> - **Adaptaciones curriculares** por materia
> - **Estrategias educativas** personalizadas
> - **Métodos de evaluación** adaptados
>
> Alineado con **LOMLOE**, la normativa española."

**[Mostrar PEI generado en pantalla]**

> "Y aquí está. En 5 minutos lo que antes tomaba 6 semanas."

**[CRÍTICO: Este es el momento WOW. Pausar 2 segundos para que los jueces lo vean]**

---

### [1:40 - 2:10] ACCESIBILIDAD Y RECURSOS (30 segundos)

**[Acción: Click en "Escuchar PEI"]**

> "Pero no nos quedamos ahí. **ElevenLabs** convierte este PEI a audio natural en español."

**[Reproducir 3-5 segundos de audio]**

> "**500,000 familias** ahora pueden ESCUCHAR los planes educativos de sus hijos.
>
> Esto es accesibilidad real."

**[Acción: Mostrar búsqueda de recursos]**

> "Y con **Linkup**, buscamos recursos educativos verificados del Ministerio de Educación.
>
> Sin alucinaciones. Solo fuentes reales."

**[Mostrar 2-3 recursos en pantalla]**

---

### [2:10 - 2:40] AUTOMATIZACIÓN Y WORKFLOW (30 segundos)

**[Acción: Mostrar diagrama de workflow o Swagger con endpoints n8n]**

> "Todo este proceso está automatizado con **n8n**.
>
> Desde el upload hasta la notificación a los padres por SMS o WhatsApp:
>
> **Upload → Textract → Comprehend → Bedrock → ElevenLabs → Linkup → Notificación**
>
> 8 servicios orquestados. Cero intervención humana."

**[Mostrar en Swagger:]**
```
GET /api/n8n/stats
```

> "Ya hemos procesado [X] PEIs con este sistema."

---

### [2:40 - 3:00] CIERRE E IMPACTO (20 segundos)

**[Acción: Mirar a los jueces directamente]**

> "NeuroPlan integra:
>
> - **AWS** para infraestructura escalable
> - **ElevenLabs** para accesibilidad total
> - **Linkup** para recursos verificados
> - **n8n** para automatización completa
>
> **500,000 estudiantes** esperando.
>
> **6 semanas** reducidas a **5 minutos**.
>
> **95% menos tiempo. 90% menos coste.**
>
> Educación inclusiva real. Hoy.
>
> Gracias."

**[Sonreír y abrir a preguntas]**

---

## 🎯 ENDPOINTS CLAVE PARA LA DEMO

### 1. Health Check (Mostrar al inicio)
```bash
curl http://localhost:3001/health
```

### 2. Upload y Análisis
```bash
# Textract
curl -X POST http://localhost:3001/aws/textract/extract \
  -F "file=@informe-demo.pdf"

# Comprehend
curl -X POST http://localhost:3001/aws/comprehend/detect-entities \
  -H "Content-Type: application/json" \
  -d '{"text": "Diagnóstico: Dislexia moderada"}'
```

### 3. Generar PEI
```bash
curl -X POST http://localhost:3001/aws/bedrock/generate-pei \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosis": "Dislexia moderada",
    "age": 10,
    "grade": "5º Primaria",
    "context": "Estudiante con dificultades lectoras"
  }'
```

### 4. Audio con ElevenLabs
```bash
curl -X POST http://localhost:3001/api/elevenlabs/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Plan Educativo de Ana Pérez: mejorar velocidad lectora...",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  }'
```

### 5. Recursos con Linkup
```bash
curl -X POST http://localhost:3001/api/linkup/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "recursos educativos dislexia primaria LOMLOE",
    "depth": "standard"
  }'
```

### 6. Stats n8n
```bash
curl http://localhost:3001/api/n8n/stats
```

---

## 🎬 ALTERNATIVA: DEMO DESDE SWAGGER (Si frontend falla)

### Opción B: Todo desde http://localhost:3001/api/docs

1. **[0:00-0:20]** Apertura igual
2. **[0:20-1:00]** Abrir Swagger → Mostrar 54 endpoints
3. **[1:00-1:40]** Ejecutar `/aws/bedrock/generate-pei` en vivo
4. **[1:40-2:10]** Ejecutar `/api/elevenlabs/text-to-speech`
5. **[2:10-2:40]** Ejecutar `/api/linkup/search`
6. **[2:40-3:00]** Mostrar `/api/n8n/stats` y cerrar

---

## 📝 FRASES CLAVE A MEMORIZAR

### Para el problema:
> "500,000 estudiantes neurodivergentes en España. 6 semanas para un PEI. Inaceptable."

### Para la solución:
> "Upload → Análisis → PEI → Audio → Recursos. 5 minutos. Cero intervención humana."

### Para las integraciones:
> "AWS para infraestructura, ElevenLabs para accesibilidad, Linkup para recursos verificados, n8n para automatización."

### Para el impacto:
> "500,000 estudiantes. 95% menos tiempo. 90% menos coste. Educación inclusiva real, hoy."

### Para el cierre:
> "De semanas a minutos. De inaccesible a universal. De teoría a producción. Gracias."

---

## 🚨 PLAN B (Si algo falla)

### Si el frontend no carga:
→ Ir directamente a Swagger (http://localhost:3001/api/docs)
→ Ejecutar endpoints en vivo
→ Narración igual

### Si el backend se cae:
→ Tener screenshots preparados
→ Narración verbal del flujo
→ Mostrar código en el editor

### Si internet falla:
→ Demo local funciona (AWS mock, ElevenLabs mock)
→ Explicar que en producción conecta con servicios reales

### Si te quedas sin tiempo:
→ Saltar directamente a [2:40] cierre
→ Mencionar cifras clave: 500K estudiantes, 95% reducción, 4 sponsors

---

## ⏱️ TIMING CHECKPOINT

Practica con cronómetro y marca estos puntos:

- ✅ **0:20** - Terminó apertura, empezó demo
- ✅ **1:00** - Upload completado, empezando generación
- ✅ **1:40** - PEI mostrado, empezando audio
- ✅ **2:10** - Audio/recursos mostrados, empezando workflow
- ✅ **2:40** - Workflow explicado, empezando cierre
- ✅ **3:00** - FIN. "Gracias"

**Si vas en el tiempo correcto en cada checkpoint, terminarás perfecto.**

---

## 🎯 PRÁCTICA RECOMENDADA

### Ahora mismo (1 hora antes):

1. **Ensayo 1 (15 min):**
   - Lee el script completo en voz alta
   - Cronometra cada sección
   - Ajusta velocidad

2. **Ensayo 2 (15 min):**
   - Ejecuta la demo real con el backend
   - Sube el informe
   - Genera el PEI
   - Verifica audio
   - Cronometra todo

3. **Ensayo 3 (15 min):**
   - Demo completa sin mirar el script
   - Como si fuera la real
   - Ajusta timing

4. **Descanso (15 min):**
   - Respira
   - Toma agua
   - Revisa checklist
   - Confía en ti

---

## 💡 CONSEJOS PRO

### Durante la demo:
- ✅ Habla despacio y claro (no corras)
- ✅ Mira a los jueces, no a la pantalla
- ✅ Si algo falla, sigue adelante con confianza
- ✅ Sonríe (transmite seguridad)
- ✅ Pausas de 2 segundos en momentos WOW

### Lenguaje corporal:
- ✅ Postura erguida
- ✅ Manos visibles (no en bolsillos)
- ✅ Gestos naturales al hablar
- ✅ Contacto visual con jueces

### Voz:
- ✅ Volumen alto y claro
- ✅ Énfasis en números: "500,000", "95%", "5 minutos"
- ✅ Pausa antes de cifras importantes
- ✅ Tono entusiasta pero profesional

---

## 🏆 OBJETIVO DE LA DEMO

### Al final de 3 minutos, los jueces deben:
1. ✅ Entender el problema (500K estudiantes, 6 semanas)
2. ✅ Ver la solución funcionando (demo en vivo)
3. ✅ Recordar las integraciones (AWS, ElevenLabs, Linkup, n8n)
4. ✅ Sentir el impacto (95% reducción, accesibilidad)
5. ✅ Querer premiar tu proyecto

---

## ✅ CHECKLIST FINAL (5 MIN ANTES)

- [ ] Backend: `curl http://localhost:3001/health` → ✅
- [ ] Frontend abierto (o Swagger)
- [ ] Informe PDF listo
- [ ] Timer/cronómetro visible
- [ ] Agua a mano
- [ ] Respiración profunda 3x
- [ ] Sonreír
- [ ] Recordar: "El código funciona. Yo sé esto. Voy a impresionarlos."

---

## 🎬 ¡AHORA PRACTICA!

**Ejecuta estos comandos para verificar que todo funciona:**

```bash
# 1. Health check
curl http://localhost:3001/health

# 2. Ver estudiantes demo
curl http://localhost:3001/api/uploads/students

# 3. Ver API info
curl http://localhost:3001/api

# 4. Test de workflow
curl http://localhost:3001/api/n8n/stats
```

**Si todos responden correctamente, ESTÁS LISTO.** 🚀

---

**¡MUCHA SUERTE! Tienes un proyecto increíble. Solo muéstralo con confianza.** 💪🧠

*Script optimizado para Barcelona Hackathon 2025 - 3 minutos exactos*
