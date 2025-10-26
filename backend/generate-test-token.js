const jwt = require('jsonwebtoken');

// Crear un token JWT de prueba
const payload = {
  sub: 'test-user-123',
  email: 'test@neuroplan.com',
  rol: 'ADMIN',
  centroId: null
};

const secret = 'neuroplan-jwt-secret-key-2024-change-in-production';
const token = jwt.sign(payload, secret, { expiresIn: '24h' });

console.log('🔑 TOKEN JWT PARA POSTMAN:');
console.log('='.repeat(50));
console.log(token);
console.log('='.repeat(50));
console.log('');
console.log('📋 Headers para Postman:');
console.log('Authorization: Bearer ' + token);
console.log('');
console.log('🧪 Endpoint de prueba:');
console.log('GET http://localhost:3001/api/health');

