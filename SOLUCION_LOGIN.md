# Solución - Problema de Login

## ✅ Estado del Sistema
- **Backend**: ✅ Funcionando en http://localhost:3001
- **Frontend**: ✅ Funcionando en http://localhost:5174
- **CORS**: ✅ Configurado correctamente

---

## ⚠️ Problema Detectado

El campo de contraseña aparece vacío en el HTML (`value=""`), lo que indica que el formulario no está capturando correctamente los valores.

---

## 🔧 Soluciones

### Solución 1: Limpiar localStorage y cookies

1. Abre las DevTools (F12)
2. Ve a la pestaña **Application**
3. En el menú lateral izquierdo:
   - Click en **Local Storage** > `http://localhost:5174` > **Clear All**
   - Click en **Session Storage** > Clear All
   - Click en **Cookies** > `http://localhost:5174` > **Clear All**
4. Recarga la página (F5 o Ctrl+R)
5. Intenta hacer login de nuevo

### Solución 2: Probar en modo incógnito

1. Abre una ventana de incógnito (Ctrl+Shift+N en Chrome)
2. Navega a http://localhost:5174/login
3. Intenta hacer login con:
   ```
   Email: test@test.com
   Contraseña: Test1234!
   ```

### Solución 3: Verificar que estás escribiendo en los campos

1. Asegúrate de **hacer click dentro del campo de email**
2. Escribe: `test@test.com`
3. Haz **click dentro del campo de contraseña**
4. Escribe: `Test1234!`
5. Verifica visualmente que el texto aparece (la contraseña se mostrará como •••••••••)
6. Haz click en **"Iniciar sesión"**

### Solución 4: Probar login desde la consola del navegador

Si el formulario no funciona, puedes hacer login directamente desde la consola:

1. Abre las DevTools (F12)
2. Ve a la pestaña **Console**
3. Pega y ejecuta este código:

```javascript
// Login directo desde consola
fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Importante para recibir las cookies
  body: JSON.stringify({
    email: 'test@test.com',
    password: 'Test1234!'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Login exitoso:', data);
  // Guardar usuario en localStorage
  if (data.data && data.data.user) {
    localStorage.setItem('neuroplan_user', JSON.stringify(data.data.user));
    // Recargar la página para que el contexto de auth se actualice
    window.location.href = '/dashboard';
  }
})
.catch(err => console.error('❌ Error en login:', err));
```

4. Si ves `✅ Login exitoso:` deberías ser redirigido al dashboard
5. Verifica que las cookies se establecieron:
   - DevTools > Application > Cookies > http://localhost:5174
   - Deberías ver `accessToken` y `refreshToken`

---

## 🧪 Testear Login desde cURL (Alternativa)

Si prefieres testear desde el terminal:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}' \
  -c cookies.txt \
  -v
```

Esto debería devolver:
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

---

## 🔍 Diagnóstico: Ver errores en la consola

Si nada de lo anterior funciona:

1. Abre las DevTools (F12)
2. Ve a la pestaña **Console**
3. Busca errores en rojo (❌)
4. Copia y pégame los errores que veas

También revisa la pestaña **Network**:
1. DevTools > Network
2. Intenta hacer login
3. Busca la petición `login` en la lista
4. Click en ella
5. Ve a la pestaña **Response** para ver la respuesta del servidor
6. Ve a la pestaña **Headers** para ver si las cookies se enviaron

---

## ✅ Verificar que el login funcionó

Después de hacer login exitosamente, verifica:

### 1. Cookies establecidas
DevTools > Application > Cookies > http://localhost:5174
- [ ] `accessToken` (httpOnly: ✅, Expires: ~15 minutos)
- [ ] `refreshToken` (httpOnly: ✅, Expires: ~7 días)

### 2. Usuario en localStorage
DevTools > Application > Local Storage > http://localhost:5174
- [ ] `neuroplan_user` con datos del usuario

### 3. Redirección al Dashboard
- [ ] Deberías ver la URL: `http://localhost:5174/dashboard`
- [ ] Deberías ver tu nombre en la interfaz

---

## 🐛 Si sigue sin funcionar...

### Verificar que el backend acepta la petición

```bash
# Verificar salud del backend
curl http://localhost:3001/api/health

# Debería devolver:
# {"status":"ok","timestamp":"..."}
```

### Verificar CORS

El backend debe permitir peticiones desde `http://localhost:5174`. Esto ya está configurado en el `.env`:

```
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Verificar logs del backend

En la terminal donde corre el backend, deberías ver algo como:

```
[Nest] ... LOG [AuthService] Autenticando usuario con Supabase Auth
```

Si ves errores, cópialos y pégamelos.

---

## 📝 Checklist de Troubleshooting

- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 5174
- [ ] Cookies y localStorage limpios
- [ ] Escribiendo correctamente email y contraseña
- [ ] Sin errores en la consola del navegador
- [ ] Petición POST a `/api/auth/login` aparece en Network
- [ ] Response de la petición muestra `"success": true`
- [ ] Cookies se establecen después del login

---

## 🎯 Última Opción: Usar el Fallback de Demostración

El frontend tiene un fallback que crea un usuario demo si el backend no responde en 8 segundos. Para forzar esto:

1. Detén el backend (Ctrl+C en la terminal del backend)
2. En el navegador, intenta hacer login
3. Espera 8 segundos
4. Deberías ser redirigido al dashboard con un "Usuario Demo"

**Nota**: Esto solo es para testing. Para usar el sistema real, necesitas que el backend esté funcionando.

---

**Última actualización**: 12 de noviembre de 2025, 19:37 CET
