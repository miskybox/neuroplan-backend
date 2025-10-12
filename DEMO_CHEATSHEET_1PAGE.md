# 🎯 DEMO 3 MINUTOS - CHEAT SHEET

## ✅ ANTES DE EMPEZAR (5 min antes)
```bash
curl http://localhost:3001/health
```
✅ Backend debe estar corriendo en puerto 3001

---

## 🎤 APERTURA (20 seg)
> "Buenos días. Soy [NOMBRE] y presento **NeuroPlan**.
> 
> **500,000 estudiantes** neurodivergentes en España necesitan PEIs.
> 
> Hoy: **6 semanas**. Con NeuroPlan: **5 minutos**.
> 
> Déjenme mostrárselo."

---

## 💻 COMANDO 1: GENERAR PEI (60 seg) ⭐ MOMENTO WOW
```bash
curl -X POST http://localhost:3001/aws/bedrock/generate-pei -H "Content-Type: application/json" -d @demo-pei.json
```

**Narración:**
> "AWS Bedrock con Claude AI genera un PEI completo: objetivos SMART, adaptaciones, estrategias, evaluación. Alineado con LOMLOE."

**[PAUSAR 3 seg cuando aparezca el resultado]**

> "Objetivos medibles, adaptaciones por materia, estrategias personalizadas. 5 minutos vs 6 semanas."

---

## 💻 COMANDO 2: RECURSOS (30 seg)
```bash
curl -X POST http://localhost:3001/api/linkup/search -H "Content-Type: application/json" -d "{\"query\":\"recursos educativos dislexia primaria España LOMLOE\"}"
```

**Narración:**
> "Linkup busca recursos verificados. Ministerio de Educación. Sin alucinaciones."

---

## 💻 COMANDO 3: WORKFLOW (30 seg)
```bash
curl http://localhost:3001/api/n8n/stats
```

**Narración:**
> "n8n orquesta todo automáticamente: upload → Textract → Comprehend → Bedrock → ElevenLabs → Linkup → notificación a familias. Cero intervención humana."

---

## 🎤 CIERRE (20 seg)
> "NeuroPlan integra:
> - **AWS** infraestructura escalable
> - **ElevenLabs** accesibilidad total
> - **Linkup** recursos verificados
> - **n8n** automatización completa
>
> **500,000 estudiantes esperando.**
> **95% menos tiempo. 90% menos coste.**
> **Educación inclusiva real. Hoy.**
> 
> Gracias."

---

## 🚨 SI ALGO FALLA
- **Plan B:** http://localhost:3001/api/docs (Swagger)
- **Plan C:** Narrar el flujo con confianza
- **Plan D:** Mostrar código en VS Code

---

## ⏱️ TIMING CHECKPOINTS
- ✅ 0:20 - Terminó apertura
- ✅ 1:20 - PEI generado (MOMENTO WOW)
- ✅ 2:00 - Recursos mostrados
- ✅ 2:40 - Workflow explicado
- ✅ 3:00 - FIN "Gracias"

---

## 📊 DATOS CLAVE
- **500,000** estudiantes neurodivergentes (España)
- **6 semanas** → **5 minutos** (95% reducción)
- **54 endpoints**, **4 sponsors**, **8 servicios**
- **€60M** TAM (mercado España)

---

## 💡 TIPS
✅ Habla DESPACIO y CLARO  
✅ Mira a los JUECES (no a la pantalla)  
✅ PAUSA 3 seg cuando aparezca el PEI  
✅ SONRÍE (transmite confianza)  
✅ Si falla algo, sigue CON CONFIANZA  

---

## 🎯 MENSAJE FINAL
**"De semanas a minutos. De inaccesible a universal. Educación inclusiva real, hoy."**

---

✅ Backend corriendo: `http://localhost:3001`  
✅ Swagger docs: `http://localhost:3001/api/docs`  
✅ Frontend: `http://localhost:8080`  

**🚀 ¡CONFÍA EN TI! El código funciona. Solo MUÉSTRALO.**
