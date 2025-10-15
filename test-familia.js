// Test script para validar el rol FAMILIA
const https = require('https');
const http = require('http');

async function testFamiliaRole() {
  console.log('🧪 Iniciando pruebas del rol FAMILIA...\n');

  // Test 1: Login con usuario familia
  const loginData = JSON.stringify({
    email: 'familia@demo.com',
    password: '123456'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3001,
    path: '/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  try {
    const loginResponse = await makeRequest(loginOptions, loginData);
    console.log('✅ Login exitoso para familia@demo.com');
    console.log(`Token: ${loginResponse.token.substring(0, 50)}...`);
    console.log(`Rol: ${loginResponse.user.rol}`);
    console.log(`Usuario: ${loginResponse.user.nombre} ${loginResponse.user.apellidos}\n`);

    // Test 2: Obtener información del usuario
    const meOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/auth/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginResponse.token}`
      }
    };

    const meResponse = await makeRequest(meOptions);
    console.log('✅ Información del usuario obtenida:');
    console.log(`ID: ${meResponse.id}`);
    console.log(`Email: ${meResponse.email}`);
    console.log(`Rol: ${meResponse.rol}`);
    console.log(`Estudiante asociado: ${meResponse.usuarioFamiliaId || 'No definido'}\n`);

    // Test 3: Intentar acceder a lista de estudiantes (debe funcionar)
    const studentsOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/uploads/students',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginResponse.token}`
      }
    };

    const studentsResponse = await makeRequest(studentsOptions);
    console.log('✅ Acceso a estudiantes permitido para FAMILIA');
    console.log(`Número de estudiantes: ${studentsResponse.length || 0}\n`);

    console.log('🎉 ¡Todas las pruebas del rol FAMILIA completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsedData.message || responseData}`));
          }
        } catch (err) {
          reject(new Error(`Parse error: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Request error: ${err.message}`));
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

// Ejecutar las pruebas
testFamiliaRole();