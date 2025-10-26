# 🚀 Script de Organización del Monorepo NeuroPlan MVP

Este script reorganiza automáticamente tu monorepo para tener la estructura correcta:

```
neuroplan-mvp/
├── frontend/          # Proyecto React/Vite
├── backend/           # Proyecto NestJS  
├── scripts/           # Scripts de utilidad
├── package.json       # Scripts del monorepo
└── .gitignore         # Archivos ignorados
```

## 📋 Qué hace el script

1. **Crea las carpetas** `frontend/`, `backend/`, `scripts/`
2. **Mueve archivos del frontend** de la raíz a `frontend/`:
   - `index.html`, `src/`, `public/`
   - `vite.config.ts`, `tailwind.config.ts`, etc.
   - `package.json` y `package-lock.json` del frontend
3. **Reorganiza archivos .env**:
   - Si `.env` contiene variables `VITE_*` → lo mueve a `frontend/.env`
   - Mantiene `backend/.env` en su lugar
4. **Crea `package.json` del monorepo** en la raíz con scripts para ejecutar ambos proyectos
5. **Actualiza `.gitignore`** para ignorar archivos de entorno

## 🖥️ Cómo ejecutar

### En Windows:
```cmd
scripts\organize-monorepo.bat
```

### En Linux/Mac:
```bash
bash scripts/organize-monorepo.sh
```

## ⚠️ IMPORTANTE

- **Ejecuta desde la raíz** del monorepo (`neuroplan-mvp/`)
- **Haz backup** de tu proyecto antes de ejecutar
- El script **NO modifica** archivos de Git, solo reorganiza la estructura local

## 🔄 Después de ejecutar

1. **Instalar dependencias del frontend:**
   ```cmd
   cd frontend
   npm install
   ```

2. **Instalar dependencias del backend:**
   ```cmd
   cd ../backend
   npm install
   ```

3. **Instalar dependencias del monorepo:**
   ```cmd
   cd ..
   npm install
   ```

4. **Ejecutar ambos proyectos:**
   ```cmd
   npm run dev
   ```

## 📁 Estructura final esperada

```
neuroplan-mvp/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── .env
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
├── scripts/
│   ├── organize-monorepo.bat
│   └── organize-monorepo.sh
├── package.json
└── .gitignore
```

## 🆘 Si algo sale mal

- Verifica que estés en la raíz del proyecto
- Revisa que tengas permisos de escritura
- Si hay errores, puedes restaurar desde tu backup y ejecutar de nuevo

---

**¡Listo para trabajar en el monorepo!** 🎉
