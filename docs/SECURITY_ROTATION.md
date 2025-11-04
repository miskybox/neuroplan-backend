# Rotación de claves y purga de historial

Este documento resume los pasos para: (1) dejar de versionar secretos, (2) purgar el historial Git si hubo exposición y (3) rotar las claves en Supabase.

> IMPORTANTE: La purga reescribe el historial. Coordina con tu equipo, cierra PRs abiertas y fuerza `push` a la rama remota tras un backup.

## 1) Asegurar que no se versionen secretos

- Añade reglas en `.gitignore` (ya aplicado):
  - frontend: `.env`, `.env.*`
  - backend: `.env*`, `env.supabase`
- Elimina archivos sensibles del árbol de trabajo (si existen):

```
# Opcional: eliminar de index si quedaron en staging
git rm --cached -r frontend/.env backend/.env backend/env.supabase || true
```

## 2) Purga de historial

Existen dos opciones principales:

### Opción A: git filter-repo (recomendado)

1. Instalar `git-filter-repo` (https://github.com/newren/git-filter-repo)
2. Ejecutar (desde la raíz del repo):

```
# Remueve archivos sensibles del historial completo
git filter-repo --force \
  --path frontend/.env --invert-paths \
  --path backend/.env --invert-paths \
  --path backend/env.supabase --invert-paths

# Verifica el historial reescrito
git log --oneline --decorate --graph --all | head -n 20

# Forzar push a remoto (tras backup y consenso del equipo)
git push --force --tags origin <branch>
```

### Opción B: BFG Repo-Cleaner

1. Descargar BFG (https://rtyley.github.io/bfg-repo-cleaner/)
2. Ejecutar:

```
java -jar bfg.jar --delete-files "env*" --delete-files "*.env" --no-blob-protection .
# O bien, para borrar por rutas específicas
java -jar bfg.jar --delete-files "frontend/.env" --delete-files "backend/.env" --delete-files "backend/env.supabase"

# Limpieza y push forzado
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force --tags origin <branch>
```

## 3) Rotación de claves en Supabase

1. Accede a Supabase > Project Settings > API.
2. Rota (Regenerate) las claves comprometidas:
   - `anon` (Frontend)
   - `service_role` (Backend)
3. Actualiza `.env` en cada app y NO las vuelvas a versionar. Ejemplo:

```
# backend/.env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_ANON_KEY=...

# frontend/.env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=60000
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

4. Si hay Integraciones externas (p.ej. AWS, Ollama), rota sus credenciales también.

## 4) Verificaciones posteriores

- `git ls-files | grep -E "(\.env|env\.supabase)"` no debe mostrar nada.
- Revisa que los pipelines de CI sigan verdes tras actualizar variables en el proveedor.
- Opcional: configura un escaneo de secretos (p.ej., gitleaks) para prevenir futuras fugas.
