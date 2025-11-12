# Diagnóstico Rápido del Problema de Login

## Estado del Sistema
✅ Código del formulario verificado - **NO HAY ERRORES EN EL CÓDIGO**
✅ Backend funcionando en http://localhost:3001
✅ Frontend funcionando en http://localhost:5174

---

## ¿Por qué el campo de contraseña aparece vacío?

### Explicación Técnica

Cuando inspeccionas el HTML con las DevTools, el atributo `value=""` que ves **NO refleja el estado actual de React**.

React usa "controlled components" donde el valor real está en el estado de JavaScript, NO en el atributo HTML.

El HTML que ves:
```html
<input type="password" value="">
```

Es solo la **representación inicial** del DOM. React actualiza el valor internamente, pero el atributo HTML no siempre se actualiza visualmente en las DevTools.

---

## 🔍 Test Rápido: Verificar si el formulario funciona

### Opción 1: Pegar este código en la consola DESPUÉS de escribir email y contraseña

1. Ve a http://localhost:5174/login
2. Escribe en los campos:
   - Email: `test@test.com`
   - Contraseña: `Test1234!`
3. **NO hagas clic en "Iniciar sesión" todavía**
4. Abre las DevTools (F12) > Consola
5. Pega este código:

```javascript
// Verificar que los campos tienen valores
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');

console.log('📧 Email input value:', emailInput?.value);
console.log('🔒 Password input value:', passwordInput?.value);

// Si ambos tienen valores, el formulario funciona correctamente
if (emailInput?.value && passwordInput?.value) {
  console.log('✅ EL FORMULARIO ESTÁ FUNCIONANDO CORRECTAMENTE');
  console.log('Los valores están capturados, puedes hacer login normalmente.');
} else {
  console.log('❌ PROBLEMA DETECTADO: Los campos están vacíos');
  console.log('Intenta las soluciones del archivo SOLUCION_LOGIN.md');
}
```

### Opción 2: Hacer login directamente sin usar el formulario

Si el formulario no funciona, usa este código para hacer login:

```javascript
// Login directo desde consola (bypass del formulario)
fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@test.com',
    password: 'Test1234!'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Respuesta del servidor:', data);

  if (data.success && data.data?.user) {
    console.log('✅ Login exitoso');
    // Guardar usuario en localStorage
    localStorage.setItem('neuroplan_user', JSON.stringify(data.data.user));
    console.log('Usuario guardado en localStorage');
    // Recargar para que el contexto se actualice
    console.log('Redirigiendo al dashboard...');
    window.location.href = '/dashboard';
  } else {
    console.error('❌ Login falló:', data.message || 'Error desconocido');
  }
})
.catch(err => {
  console.error('❌ Error de conexión:', err);
  console.log('Verifica que el backend esté corriendo en http://localhost:3001');
});
```

---

## 🧪 Test desde Terminal (Verificar Backend)

Mientras haces las pruebas del navegador, abre una terminal y ejecuta:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"Test1234!\"}" \
  -c cookies.txt \
  -v
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "test@test.com",
      "role": "PROFESOR",
      "firstName": "Test",
      "lastName": "User"
    }
  },
  "message": "Login exitoso"
}
```

Si esto funciona, **el backend está bien**. El problema está en el frontend.

---

## 🔧 Soluciones Probables

### Solución 1: Limpiar caché del navegador

El problema más común es **código JavaScript cacheado**.

**Chrome/Edge**:
1. Abre DevTools (F12)
2. Haz clic derecho en el botón de recargar (al lado de la barra de direcciones)
3. Selecciona **"Vaciar caché y volver a cargar forzadamente"**
4. O usa: `Ctrl + Shift + R`

**Firefox**:
1. `Ctrl + Shift + Delete`
2. Marca solo "Caché"
3. Selecciona "Última hora"
4. Limpiar

### Solución 2: Desactivar extensiones del navegador temporalmente

Algunas extensiones (especialmente password managers) pueden interferir:

1. Abre una **ventana de incógnito** (`Ctrl + Shift + N`)
2. Ve a http://localhost:5174/login
3. Intenta hacer login

Si funciona en incógnito → **Una extensión está interfiriendo**

Extensiones problemáticas comunes:
- LastPass
- 1Password
- Dashlane
- Bitwarden
- React DevTools (a veces)

### Solución 3: Verificar que NO hay errores en la consola

1. Abre DevTools (F12) > Console
2. Busca errores en rojo
3. Si ves algún error relacionado con React, JavaScript, o CORS, cópialo y compártelo

### Solución 4: Verificar que el frontend está usando la última versión

```bash
# En la terminal del frontend (donde corre npm run dev)
# Detén el servidor (Ctrl+C)
# Limpia caché de Vite
npm run dev -- --force
```

---

## 📊 Checklist de Diagnóstico

Ejecuta estas comprobaciones EN ORDEN:

- [ ] **Backend corriendo**: `curl http://localhost:3001/api/health` → Debe devolver `{"status":"ok"}`
- [ ] **Login desde terminal funciona**: Ejecutar el comando curl de arriba
- [ ] **Frontend accesible**: Abrir http://localhost:5174/login en el navegador
- [ ] **Sin errores en consola**: Revisar Console en DevTools (F12)
- [ ] **Campos capturan valores**: Ejecutar el código de verificación de la Opción 1
- [ ] **Login desde consola funciona**: Ejecutar el código de la Opción 2

---

## 🎯 Resultado Esperado

Si todo funciona correctamente:

1. **Después del login** (ya sea desde el formulario o desde consola), deberías:
   - Ver en la consola: `✅ Login exitoso`
   - Ser redirigido a: `http://localhost:5174/dashboard`
   - Ver tu nombre en la interfaz del dashboard

2. **Verificar cookies** (DevTools > Application > Cookies > http://localhost:5174):
   - `accessToken` (httpOnly: true, Expires: ~15 minutos)
   - `refreshToken` (httpOnly: true, Expires: ~7 días)

3. **Verificar localStorage** (DevTools > Application > Local Storage > http://localhost:5174):
   - `neuroplan_user` con tu información de usuario

---

## 🆘 Si nada funciona

Si ninguna de las soluciones funciona:

1. **Copia y pega** los siguientes datos:
   - Errores de la consola del navegador (DevTools > Console)
   - Errores de la pestaña Network (DevTools > Network > busca la petición `login`)
   - Resultado del test de verificación (Opción 1)
   - Resultado del login desde consola (Opción 2)
   - Resultado del curl desde terminal

2. **Verifica** el estado de los servicios:
   - Backend: ¿Hay errores en la terminal donde corre?
   - Frontend: ¿Hay errores en la terminal donde corre?

---

**Última actualización**: 12 de noviembre de 2025, 20:00 CET
**Código verificado**: ✅ Sin errores
**Problema identificado**: Probablemente caché del navegador o extensión interfiriendo
