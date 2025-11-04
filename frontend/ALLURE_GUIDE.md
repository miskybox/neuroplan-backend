# 📊 Allure Test Reporter - Guía de Uso

## 🚀 Instalación Rápida

### Opción 1: NPX (Sin instalación global)

```bash
cd frontend
npm run test:e2e:api
npx allure serve allure-results
```

### Opción 2: Instalar Allure CLI globalmente

```bash
npm install -g allure-commandline
```

### Opción 3: Usar script Windows

```cmd
run-tests-allure.bat
```

---

## 📦 Requisitos

- **Java 8+** instalado (Allure lo necesita)
  - Verifica con: `java -version`
  - Descarga: https://adoptium.net/

---

## 🎯 Comandos Disponibles

### 1. **Ejecutar tests y ver reporte en vivo**

```bash
cd frontend
npm run test:e2e:api
npx allure serve allure-results
```

### 2. **Solo generar reporte HTML**

```bash
cd frontend
npm run allure:generate
```

### 3. **Abrir reporte ya generado**

```bash
cd frontend
npm run allure:open
```

### 4. **Todo en uno (test + serve)**

```bash
cd frontend
npm run test:e2e:allure
```

---

## 📁 Estructura de Reportes

```
frontend/
├── allure-results/     # Datos crudos de tests (generado por Playwright)
├── allure-report/      # Reporte HTML generado (estático)
├── playwright-report/  # Reporte HTML de Playwright (alternativo)
└── test-results/       # Screenshots, videos, traces
```

---

## 🌟 Características de Allure

### ✅ Visualización en Tiempo Real

- Dashboard con métricas: passed, failed, skipped
- Gráficos de torta y líneas de tiempo
- Historial de ejecuciones

### 📊 Información Detallada

- Logs de cada test
- Screenshots automáticos en fallos
- Trace viewer integrado
- Duración de tests
- Categorización de errores

### 🔍 Navegación

- Filtros por status (passed/failed/skipped)
- Búsqueda por nombre de test
- Agrupación por suites
- Tags y categorías

---

## 🎨 Comparación: Playwright HTML vs Allure

| Característica | Playwright HTML  | Allure Report          |
| -------------- | ---------------- | ---------------------- |
| Instalación    | ✅ Incluido      | ⚠️ Requiere Java + CLI |
| Visualización  | Básica           | 🌟 Profesional         |
| Gráficos       | Limitados        | 📊 Completos           |
| Historial      | No               | ✅ Sí                  |
| Categorización | No               | ✅ Sí                  |
| En vivo        | No               | ✅ Sí (con serve)      |
| Exportable     | ✅ HTML estático | ✅ HTML estático       |

---

## 🐛 Troubleshooting

### Error: "allure: command not found"

**Solución 1**: Usa NPX (no requiere instalación)

```bash
npx allure serve allure-results
```

**Solución 2**: Instala globalmente

```bash
npm install -g allure-commandline
```

### Error: "JAVA_HOME not found"

Instala Java 8+ desde: https://adoptium.net/

### Los resultados no se muestran

Verifica que `allure-results/` tenga archivos `.json`:

```bash
ls -la frontend/allure-results/
```

---

## 📸 Screenshots y Videos

Allure muestra automáticamente:

- 📷 Screenshots en tests fallidos
- 🎥 Videos de ejecución (si configurado)
- 🔍 Traces de Playwright

Configurado en `playwright.config.ts`:

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
}
```

---

## 🚀 Quick Start

**Si tienes Java instalado:**

```bash
cd frontend
npm run test:e2e:api
npx allure serve allure-results
```

**Si NO tienes Java:**

```bash
cd frontend
npm run test:e2e:api
npx playwright show-report
```

---

## 📚 Recursos

- [Allure Docs](https://docs.qameta.io/allure/)
- [Allure Playwright Integration](https://www.npmjs.com/package/allure-playwright)
- [Playwright Reports](https://playwright.dev/docs/test-reporters)

---

## 💡 Recomendación

Para uso diario: **Playwright HTML Report** (más rápido, sin dependencias)

```bash
npm run test:e2e:api
npx playwright show-report
```

Para demos/presentaciones: **Allure Report** (más visual y profesional)

```bash
npm run test:e2e:allure
```
