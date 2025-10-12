# 🎯 PRÁCTICA RÁPIDA - EJECUTA AHORA

## ⏱️ ENSAYO COMPLETO (3 minutos)

**INSTRUCCIONES:** Lee en voz alta, ejecuta los comandos, cronometra.

---

## ✅ PREPARACIÓN (30 segundos antes)

### 1. Verifica backend:
```bash
curl http://localhost:3001/health
```

✅ **Esperado:** `"status":"healthy"`

### 2. Verifica archivo demo:
```bash
dir demo-pei.json
```

✅ **Esperado:** Archivo existe

### 3. Timer listo:
- Abre temporizador online: https://www.online-stopwatch.com/
- O usa tu teléfono
- Configura: 3 minutos

---

## 🎬 ENSAYO 1: COMPLETO CON VOZ

### [INICIAR TIMER]

### 0:00 - 0:20 | APERTURA
**Lee en VOZ ALTA:**

> "Buenos días. Soy [TU NOMBRE] y les presento NeuroPlan.
> 
> En España, 500,000 estudiantes neurodivergentes necesitan Planes Educativos Individualizados.
> 
> Hoy, crear un PEI tarda 6 semanas.
> 
> Con NeuroPlan, tarda 5 minutos.
> 
> Déjenme mostrárselo."

### 0:20 - 0:30 | TRANSICIÓN
**Lee en VOZ ALTA:**

> "Este es un informe psicopedagógico real de Ana, 10 años, dislexia moderada."

### 0:30 - 1:20 | GENERAR PEI ⭐

**EJECUTA:**
```bash
curl -X POST http://localhost:3001/aws/bedrock/generate-pei -H "Content-Type: application/json" -d @demo-pei.json
```

**MIENTRAS EJECUTA, lee en VOZ ALTA:**

> "El sistema automáticamente extrae el diagnóstico y síntomas. AWS Bedrock con Claude AI analiza el caso. Y genera un Plan Educativo Individualizado completo."

**CUANDO APAREZCA EL RESULTADO:**

**[PAUSAR 3 SEGUNDOS - NO HABLES - SOLO MIRA EL JSON]**

**Luego lee:**

> "Y aquí está. Objetivos SMART medibles: mejorar velocidad lectora de 60 a 90 palabras por minuto. Adaptaciones curriculares específicas. Estrategias educativas. Sistema de evaluación adaptado. Plan de seguimiento trimestral. Todo alineado con LOMLOE. Esto es lo que antes tomaba 6 semanas. Ahora: 5 minutos."

### 1:20 - 1:50 | RECURSOS

**EJECUTA:**
```bash
curl -X POST http://localhost:3001/api/linkup/search -H "Content-Type: application/json" -d "{\"query\":\"recursos educativos dislexia primaria España LOMLOE\"}"
```

**MIENTRAS EJECUTA, lee:**

> "Pero no nos quedamos ahí. El sistema también busca recursos educativos verificados con Linkup. Recursos del Ministerio de Educación. Sin alucinaciones. Solo fuentes reales verificadas."

**CUANDO APAREZCA:**

> "Estrategias de autorregulación, actividades de mindfulness, todo específico para dislexia en primaria. Esto es accesibilidad real. 500,000 familias ahora tienen acceso inmediato."

### 1:50 - 2:20 | WORKFLOW

**EJECUTA:**
```bash
curl http://localhost:3001/api/n8n/stats
```

**MIENTRAS EJECUTA, lee:**

> "Todo este proceso está automatizado con n8n. Desde el upload hasta la notificación a las familias. El flujo completo: upload del informe, AWS Textract extrae texto, AWS Comprehend detecta entidades médicas, AWS Bedrock genera el PEI, Linkup busca recursos, notificación a familias. 8 servicios orquestados. Cero intervención humana. 54 endpoints funcionales integrando 4 sponsors principales: AWS, ElevenLabs, Linkup, n8n."

### 2:20 - 3:00 | CIERRE

**Lee CON EMOCIÓN:**

> "NeuroPlan es la solución a un problema urgente. 500,000 estudiantes neurodivergentes en España esperando. De 6 semanas a 5 minutos. 95% menos tiempo. 90% menos coste. Integración profunda con AWS para infraestructura escalable. ElevenLabs para accesibilidad total. Linkup para recursos verificados. n8n para automatización completa. Educación inclusiva no es una aspiración. Con NeuroPlan, es una realidad. Hoy. Gracias."

### [DETENER TIMER]

---

## 📊 EVALUACIÓN DEL ENSAYO 1

¿En qué tiempo terminaste?

- ✅ **2:50 - 3:05**: PERFECTO - Estás en el rango ideal
- ⚠️ **2:30 - 2:49**: Muy rápido - REDUCE velocidad 20%
- ⚠️ **3:06 - 3:20**: Un poco lento - AUMENTA velocidad 10%
- ❌ **< 2:30 o > 3:20**: Ajustar mucho - Revisar script

---

## 🎬 ENSAYO 2: SIN LEER (solo conceptos)

**Objetivo:** Demostrar que memorizaste los conceptos clave.

### [INICIAR TIMER]

### 0:00 - 0:20 | Di de memoria:
- Presentación personal
- 500,000 estudiantes
- 6 semanas vs 5 minutos
- "Déjenme mostrárselo"

### 0:30 - 1:20 | Ejecuta PEI + Narra:
- Comando curl
- Explica: Textract, Comprehend, Bedrock
- Pausa 3 seg cuando aparezca
- Menciona objetivos, adaptaciones, LOMLOE
- Cierra: "6 semanas → 5 minutos"

### 1:20 - 1:50 | Ejecuta Linkup + Narra:
- Comando curl
- Explica: Recursos verificados, Ministerio Educación
- Menciona: 500,000 familias

### 1:50 - 2:20 | Ejecuta n8n + Narra:
- Comando curl
- Explica flujo: upload → Textract → Comprehend → Bedrock → Linkup
- Menciona: 54 endpoints, 4 sponsors

### 2:20 - 3:00 | Cierre emotivo:
- 500,000 estudiantes esperando
- 95% menos tiempo, 90% menos coste
- Sponsors: AWS, ElevenLabs, Linkup, n8n
- "Educación inclusiva real, hoy"
- "Gracias"

### [DETENER TIMER]

---

## 📊 EVALUACIÓN DEL ENSAYO 2

¿Te salieron todos los conceptos clave?

- [ ] Mencionaste 500,000 estudiantes
- [ ] Mencionaste 6 semanas vs 5 minutos
- [ ] Ejecutaste los 3 comandos correctamente
- [ ] Pausaste 3 seg cuando apareció el PEI
- [ ] Mencionaste los 4 sponsors
- [ ] Mencionaste 95% menos tiempo, 90% menos coste
- [ ] Cerraste con "Gracias"

**Si marcaste 7/7: ✅ LISTO PARA LA DEMO**

**Si marcaste 5-6/7: ⚠️ Ensayo 3 necesario**

**Si marcaste < 5/7: ❌ Revisar script completo**

---

## 🎬 ENSAYO 3: SIMULACIÓN REAL (Como si fueran los jueces)

### Configuración:
1. Cierra todos los tabs excepto terminal
2. Pon el temporizador VISIBLE
3. Párate como si estuvieras presentando
4. Imagina 3 jueces frente a ti
5. SONRÍE antes de empezar

### [INICIAR TIMER - PRESENTAR COMO SI FUERA REAL]

[Hacer demo completa sin mirar notas]

### [DETENER TIMER]

---

## 📊 EVALUACIÓN DEL ENSAYO 3

### Timing:
- [ ] Terminé entre 2:50 - 3:10 ✅

### Ejecución técnica:
- [ ] Todos los comandos funcionaron ✅
- [ ] No hubo errores técnicos ✅

### Narrativa:
- [ ] Hablé despacio y claro ✅
- [ ] Pausé en momentos clave ✅
- [ ] Mencioné todas las cifras importantes ✅

### Presencia:
- [ ] Mantuve contacto visual (imaginario) ✅
- [ ] Sonreí durante la demo ✅
- [ ] Mostré confianza ✅

**Si marcaste 9/9: 🏆 ESTÁS 100% LISTO**

---

## ⚡ PRÁCTICA EXPRESS (1 minuto)

Si solo tienes 1 minuto para practicar:

### ENSAYO MENTAL:

1. **Cierra los ojos**

2. **Visualiza:**
   - Tú frente a los jueces
   - Terminal abierto
   - Ejecutando comandos
   - JSON del PEI apareciendo
   - Jueces asintiendo impresionados
   - Tú cerrando con "Gracias"
   - Aplausos

3. **Repite mentalmente:**
   - "500,000 estudiantes"
   - "6 semanas → 5 minutos"
   - "95% menos tiempo"
   - "AWS, ElevenLabs, Linkup, n8n"
   - "Educación inclusiva real, hoy"

4. **Respira profundo 3 veces**

5. **Sonríe**

6. **Abre los ojos**

**Estás listo. Confía en ti.**

---

## 🚨 TEST FINAL PRE-DEMO (3 minutos antes)

### Checklist técnico:

```bash
# 1. Backend health
curl http://localhost:3001/health
```
✅ **Debe responder** `"status":"healthy"`

```bash
# 2. Archivo demo existe
dir demo-pei.json
```
✅ **Debe existir**

```bash
# 3. Test rápido PEI
curl -X POST http://localhost:3001/aws/bedrock/generate-pei -H "Content-Type: application/json" -d @demo-pei.json
```
✅ **Debe generar JSON con objetivos, adaptations, strategies**

### Checklist personal:
- [ ] Agua a mano
- [ ] Terminal con fuente grande
- [ ] Postura erguida
- [ ] Respiración calmada
- [ ] Sonrisa
- [ ] Confianza

---

## 💡 TIPS BASADOS EN TU PRÁCTICA

### Si te trabaste en algún punto:
✅ **Practica ESE punto 5 veces más**

Ejemplo:
```bash
# Si te trabaste en el comando PEI, repítelo 5 veces:
curl -X POST http://localhost:3001/aws/bedrock/generate-pei -H "Content-Type: application/json" -d @demo-pei.json
curl -X POST http://localhost:3001/aws/bedrock/generate-pei -H "Content-Type: application/json" -d @demo-pei.json
curl -X POST http://localhost:3001/aws/bedrock/generate-pei -H "Content-Type: application/json" -d @demo-pei.json
curl -X POST http://localhost:3001/aws/bedrock/generate-pei -H "Content-Type: application/json" -d @demo-pei.json
curl -X POST http://localhost:3001/aws/bedrock/generate-pei -H "Content-Type: application/json" -d @demo-pei.json
```

**Ahora ese comando está en tu memoria muscular** ✅

### Si te quedaste sin tiempo:
✅ **Elimina detalles, mantén cifras clave**

Conserva SIEMPRE:
- "500,000 estudiantes"
- "6 semanas → 5 minutos"
- "95% menos tiempo"
- "AWS, ElevenLabs, Linkup, n8n"

Puedes OMITIR:
- Detalles técnicos (Textract, Comprehend)
- Ejemplo de Ana (si ya ejecutaste el comando)
- Flujo completo paso a paso (solo di "automatizado")

### Si te sobrara tiempo:
✅ **Añade datos de mercado**

- "€60 millones mercado España"
- "2 millones estudiantes Europa"
- "Expansión prevista Portugal, Italia, Francia"

---

## 🎯 REGLA DE ORO

**"Mejor terminar en 2:55 con CLARIDAD que en 3:05 apurado"**

Los jueces prefieren:
- ✅ Demo clara y tranquila
- ❌ Demo apurada y confusa

**Si llegas a 2:40 y has mostrado todo: CIERRA.**

No necesitas llenar 3 minutos exactos si ya impresionaste.

---

## 🏆 MENSAJE FINAL

**Has practicado.**

**El código funciona.**

**Sabes lo que vas a decir.**

**Ahora solo queda MOSTRARLO con confianza.**

**500,000 estudiantes reales necesitan tu proyecto.**

**Los jueces necesitan ver eso en tus ojos.**

**Ve allá y gánales el corazón.**

---

🚀 **¡ADELANTE! Tienes esto.** 💪🧠

*Práctica completada. Demo lista. Presentación en 2 horas. GO!* 🎯
