const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5432/neuroplan?schema=public',
});

async function createUsers() {
  console.log('===========================================');
  console.log('CREATING NEUROPLAN USERS');
  console.log('===========================================');
  console.log();

  try {
    // Contraseñas para los usuarios
    const users = [
      { email: 'admin@demo.com', password: 'Admin123!', role: 'ADMIN', nombre: 'Admin', apellidos: 'NeuroPlan' },
      { email: 'orientador@demo.com', password: 'Orientador123!', role: 'ORIENTADOR', nombre: 'Orientador', apellidos: 'Test' },
      { email: 'profesor@demo.com', password: 'Profesor123!', role: 'PROFESOR', nombre: 'Profesor', apellidos: 'Test' },
      { email: 'director@demo.com', password: 'Director123!', role: 'DIRECTOR_CENTRO', nombre: 'Director', apellidos: 'Test' },
      { email: 'familia@demo.com', password: 'Familia123!', role: 'FAMILIA', nombre: 'Familia', apellidos: 'Test' }
    ];

    for (const user of users) {
      console.log(`Creando usuario: ${user.email} (${user.role})`);
      
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Insertar o actualizar usuario
      await pool.query(`
        INSERT INTO "User" (email, password, role, nombre, apellidos, activo)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (email) 
        DO UPDATE SET 
          password = EXCLUDED.password,
          role = EXCLUDED.role,
          nombre = EXCLUDED.nombre,
          apellidos = EXCLUDED.apellidos,
          activo = EXCLUDED.activo
      `, [user.email, hashedPassword, user.role, user.nombre, user.apellidos]);
      
      console.log(`✅ Usuario ${user.email} creado/actualizado`);
    }

    console.log();
    console.log('===========================================');
    console.log('✅ TODOS LOS USUARIOS CREADOS EXITOSAMENTE');
    console.log('===========================================');
    console.log();
    console.log('Credenciales para testing:');
    console.log('admin@demo.com / Admin123!');
    console.log('orientador@demo.com / Orientador123!');
    console.log('profesor@demo.com / Profesor123!');
    console.log('director@demo.com / Director123!');
    console.log('familia@demo.com / Familia123!');
    console.log();

  } catch (error) {
    console.log('❌ ERROR CREANDO USUARIOS:');
    console.log(error.message);
  } finally {
    await pool.end();
  }
}

// Ejecutar creación de usuarios
createUsers();
