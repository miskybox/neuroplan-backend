# ⏱️ CRONOGRAMA SEGUNDO A SEGUNDO - DEMO 3 MINUTOS

## 🎯 OBJETIVO: Impresionar a los jueces mostrando el flujo completo funcionando

---

## 📍 SEGUNDO 00:00 - 00:20 | APERTURA (20 segundos)

### Acción:
- Respirar profundo
- Mirar a los jueces directamente
- Sonreír

### Script EXACTO:
> "Buenos días. Soy [TU NOMBRE] y les presento **NeuroPlan**.
> 
> [Pausa 1 seg]
> 
> En España, **500,000 estudiantes neurodivergentes** necesitan Planes Educativos Individualizados.
> 
> [Pausa 1 seg]
> 
> Hoy, crear un PEI tarda **6 semanas**.
> 
> [Pausa 1 seg - énfasis]
> 
> Con NeuroPlan, tarda **5 minutos**.
> 
> [Pausa 1 seg]
> 
> Déjenme mostrárselo."

### Timing:
- Palabra "NeuroPlan": 0:03
- "500,000 estudiantes": 0:08
- "6 semanas": 0:13
- "5 minutos": 0:17
- "mostrárselo": 0:20 ✅ CHECKPOINT

---

## 📍 SEGUNDO 00:20 - 00:30 | PREPARACIÓN TÉCNICA (10 segundos)

### Acción:
- Cambiar a terminal (ya debe estar abierto)
- Verificar que `demo-pei.json` existe en el directorio

### Script mientras preparas:
> "Este es un informe psicopedagógico real de Ana, 10 años, dislexia moderada."

### Comando (NO ejecutar aún, solo tenerlo listo):
```bash
curl -X POST http://localhost:3001/aws/bedrock/generate-pei -H "Content-Type: application/json" -d @demo-pei.json
```

### Timing:
- Terminal visible: 0:22
- Manos en teclado: 0:25
- Listo para ejecutar: 0:30 ✅ CHECKPOINT

---

## 📍 SEGUNDO 00:30 - 01:30 | GENERACIÓN PEI - MOMENTO WOW ⭐ (60 segundos)

### Acción 1: Ejecutar comando (00:30 - 00:32)
```bash
curl -X POST http://localhost:3001/aws/bedrock/generate-pei -H "Content-Type: application/json" -d @demo-pei.json
```

### Script mientras ejecuta (00:32 - 00:45):
> "El sistema automáticamente:
> 
> **Uno.** Extrae el diagnóstico y síntomas.
> 
> [Pausa mientras aparece resultado]
> 
> **Dos.** AWS Bedrock con Claude AI analiza el caso.
> 
> [Señalar pantalla]
> 
> **Tres.** Genera un Plan Educativo Individualizado completo."

### Acción 2: Cuando aparezca el JSON (00:45)
**[CRÍTICO: PAUSAR 3 SEGUNDOS - Dejar que los jueces VEAN el resultado]**

### Script post-resultado (00:48 - 01:10):
> "Y aquí está.
> 
> [Señalar en pantalla mientras hablas]
> 
> **Objetivos SMART** medibles: mejorar velocidad lectora de 60 a 90 palabras por minuto en 6 meses.
> 
> **Adaptaciones curriculares** específicas: tiempo extra 50%, tipografía OpenDyslexic, evaluación oral preferente.
> 
> **Estrategias educativas**: método Orton-Gillingham multisensorial, fragmentación de tareas, refuerzo positivo.
> 
> **Sistema de evaluación** adaptado: 60% oral, 30% proyectos, 10% escrito.
> 
> **Plan de seguimiento** trimestral con familia y tutor."

### Script cierre sección (01:10 - 01:20):
> "Todo alineado con **LOMLOE**, la normativa española.
> 
> [Pausa 2 segundos - énfasis]
> 
> Esto es lo que antes tomaba **6 semanas**.
> 
> Ahora: **5 minutos**."

### Timing:
- Comando ejecutado: 0:32
- JSON visible: 0:45
- Pausa WOW: 0:45-0:48
- Explicación completa: 1:10
- Cierre sección: 1:20 ✅ CHECKPOINT

---

## 📍 SEGUNDO 01:20 - 01:50 | ACCESIBILIDAD Y RECURSOS (30 segundos)

### Acción 1: Preparar comando Linkup (01:20 - 01:22)

### Script transición (01:22 - 01:30):
> "Pero no nos quedamos ahí.
> 
> [Preparar comando]
> 
> El sistema también busca **recursos educativos verificados** con Linkup."

### Comando (01:30):
```bash
curl -X POST http://localhost:3001/api/linkup/search -H "Content-Type: application/json" -d "{\"query\":\"recursos educativos dislexia primaria España LOMLOE\"}"
```

### Script mientras ejecuta (01:30 - 01:40):
> "Recursos del **Ministerio de Educación**.
> 
> Guías, actividades, estrategias probadas.
> 
> **Sin alucinaciones**. Solo fuentes reales verificadas."

### Script cuando aparezca resultado (01:40 - 01:50):
> "Aquí: estrategias de autorregulación, actividades de mindfulness, todo específico para dislexia en primaria.
> 
> Esto es accesibilidad real.
> 
> **500,000 familias** ahora tienen acceso inmediato a recursos de calidad."

### Timing:
- Comando ejecutado: 1:30
- Recursos visibles: 1:38
- Explicación completa: 1:50 ✅ CHECKPOINT

---

## 📍 SEGUNDO 01:50 - 02:20 | AUTOMATIZACIÓN WORKFLOW (30 segundos)

### Acción 1: Preparar comando n8n (01:50 - 01:52)

### Script transición (01:52 - 02:00):
> "Todo este proceso está **automatizado con n8n**.
> 
> Desde el upload hasta la notificación a las familias."

### Comando (02:00):
```bash
curl http://localhost:3001/api/n8n/stats
```

### Script explicación workflow (02:00 - 02:15):
> "El flujo completo:
> 
> **Upload del informe** → **AWS Textract** extrae texto → **AWS Comprehend** detecta entidades médicas → **AWS Bedrock** genera el PEI → **Linkup** busca recursos → **notificación** a familias por email o SMS.
> 
> **8 servicios orquestados**.
> 
> **Cero intervención humana**."

### Script arquitectura (02:15 - 02:20):
> "**54 endpoints funcionales** integrando **4 sponsors principales**:
> 
> AWS, ElevenLabs, Linkup, n8n."

### Timing:
- Comando n8n: 2:00
- Stats visibles: 2:05
- Explicación workflow: 2:15
- Arquitectura mencionada: 2:20 ✅ CHECKPOINT

---

## 📍 SEGUNDO 02:20 - 03:00 | CIERRE E IMPACTO FINAL (40 segundos)

### Acción: Minimizar terminal, mirar a jueces directamente

### Script FINAL (02:20 - 02:50):
> "NeuroPlan es la solución a un problema urgente.
> 
> [Pausa 2 seg - contacto visual con jueces]
> 
> **500,000 estudiantes neurodivergentes** en España **esperando**.
> 
> [Pausa 1 seg]
> 
> De **6 semanas** a **5 minutos**.
> 
> **95% menos tiempo**.
> 
> **90% menos coste**.
> 
> [Pausa 2 seg - dejar que asimilen]
> 
> Integración profunda con **AWS** para infraestructura escalable.
> 
> **ElevenLabs** para accesibilidad total: las familias pueden **escuchar** los PEIs.
> 
> **Linkup** para recursos verificados sin alucinaciones.
> 
> **n8n** para automatización completa end-to-end."

### Cierre emotivo (02:50 - 03:00):
> [Pausa, respirar]
> 
> "Educación inclusiva no es una aspiración.
> 
> Con NeuroPlan, es una **realidad**.
> 
> **Hoy**.
> 
> [Pausa 1 seg, sonreír]
> 
> Gracias."

### Timing:
- Mirada a jueces: 2:22
- Cifras de impacto: 2:30
- Sponsors mencionados: 2:45
- "Gracias" final: 3:00 ✅ FIN PERFECTO

---

## 🚨 AJUSTES DE TIMING EN TIEMPO REAL

### Si vas ADELANTADO (llegas a 2:40 con 20 seg sobrantes):

**Añade en cierre:**
> "Nuestro mercado addressable en España: **€60 millones** en sector educativo público y privado.
> 
> Con expansión prevista a Portugal, Italia, Francia.
> 
> **2 millones de estudiantes** neurodivergentes en Europa."

### Si vas ATRASADO (llegas a 2:40 con solo 5 seg):

**Cierre express:**
> "500,000 estudiantes. 95% menos tiempo. 90% menos coste. Educación inclusiva real, hoy. Gracias."

---

## 📊 CHECKPOINTS DE CONTROL

Usa tu cronómetro y verifica estos puntos:

| Tiempo | Checkpoint | ¿Dónde debes estar? |
|--------|-----------|---------------------|
| 0:20 | ✅ Apertura completa | "Déjenme mostrárselo" |
| 0:30 | ✅ Terminal listo | Comando PEI preparado |
| 1:20 | ✅ PEI mostrado | "6 semanas → 5 minutos" |
| 1:50 | ✅ Recursos mostrados | "500,000 familias" |
| 2:20 | ✅ Workflow explicado | "54 endpoints, 4 sponsors" |
| 3:00 | ✅ CIERRE | "Gracias" |

**Si estás ±5 segundos en cada checkpoint, terminarás PERFECTO.**

---

## 💡 CONSEJOS CRÍTICOS

### Velocidad de habla:
- ❌ NO corras - Los jueces necesitan ASIMILAR
- ✅ Habla 20% MÁS DESPACIO de lo normal
- ✅ Las pausas son TU AMIGO (dejan impacto)

### Énfasis en números:
- Pausar ANTES de cada cifra importante
- "500,000" → pausa 0.5 seg antes
- "6 semanas" → pausa 0.5 seg antes y después
- "5 minutos" → pausa 1 seg después
- "95% menos tiempo" → pausa 1 seg después

### Contacto visual:
- 0:00-0:20: Mirar a TODOS los jueces
- 0:30-1:30: 70% pantalla, 30% jueces
- 1:30-2:20: 60% pantalla, 40% jueces
- 2:20-3:00: 80% jueces, 20% pantalla

### Momentos de pausa críticos:
1. **Después de "5 minutos"** (0:17) → pausa 1 seg
2. **Cuando aparece el PEI JSON** (0:45) → pausa 3 seg ⭐
3. **Después de "6 semanas → 5 minutos"** (1:18) → pausa 2 seg
4. **Antes de "500,000 estudiantes esperando"** (2:25) → pausa 2 seg
5. **Antes de "Gracias"** (2:59) → pausa 1 seg

---

## 🎬 CHECKLIST 60 SEGUNDOS ANTES

- [ ] Backend corriendo: `curl http://localhost:3001/health` ✅
- [ ] Terminal abierto, fuente grande (zoom 150%)
- [ ] Directorio correcto (`neuroplan-backend/`)
- [ ] `demo-pei.json` existe
- [ ] Cronómetro visible
- [ ] Agua a mano
- [ ] Postura erguida
- [ ] Respirar profundo 3x
- [ ] Sonreír
- [ ] **Recordar:** "El código funciona. Yo sé esto. Voy a ganar."

---

## 🏆 OBJETIVO FINAL

Al terminar, los jueces deben:

1. ✅ **Entender** el problema (500K estudiantes, 6 semanas)
2. ✅ **Ver** la solución funcionando (demo en vivo exitosa)
3. ✅ **Recordar** las cifras (95% reducción, 5 minutos)
4. ✅ **Apreciar** las integraciones (AWS, ElevenLabs, Linkup, n8n)
5. ✅ **Sentir** el impacto ("Educación inclusiva real, hoy")
6. ✅ **Querer** premiar tu proyecto 🥇

---

## 🎯 FRASE MENTAL ANTES DE EMPEZAR

**Repite mentalmente:**

> "Tengo un proyecto increíble que funciona.
> 
> Ayuda a 500,000 estudiantes reales.
> 
> Solo necesito mostrarlo con claridad y confianza.
> 
> Voy a hacerlo perfecto."

---

🚀 **¡AHORA PRACTICA 2-3 VECES CON CRONÓMETRO!** ⏱️

**Si sigues este cronograma segundo a segundo, terminarás EXACTO en 3:00 minutos.**

*Optimizado para Barcelona Hackathon 2025 - NeuroPlan Demo*
