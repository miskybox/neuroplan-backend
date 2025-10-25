// ===========================================
// SETUP SQLITE DATABASE FOR DEVELOPMENT
// ===========================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, 'neuroplan.db');

console.log('🚀 Configurando base de datos SQLite para desarrollo...');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a SQLite:', err.message);
    return;
  }
  console.log('✅ Conectado a SQLite database');
});

// Crear tablas
const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabla users
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'PROFESOR',
          first_name TEXT,
          last_name TEXT,
          center_id TEXT,
          active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabla students
      db.run(`
        CREATE TABLE IF NOT EXISTS students (
          id TEXT PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          birth_date DATE,
          grade TEXT,
          parent_name TEXT,
          parent_email TEXT,
          parent_phone TEXT,
          school TEXT,
          center_id TEXT,
          created_by TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);

      // Tabla reports
      db.run(`
        CREATE TABLE IF NOT EXISTS reports (
          id TEXT PRIMARY KEY,
          student_id TEXT,
          filename TEXT NOT NULL,
          original_name TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          size INTEGER NOT NULL,
          storage_path TEXT NOT NULL,
          extracted_text TEXT,
          status TEXT DEFAULT 'PENDING',
          processed_at DATETIME,
          created_by TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id),
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);

      // Tabla peis
      db.run(`
        CREATE TABLE IF NOT EXISTS peis (
          id TEXT PRIMARY KEY,
          student_id TEXT,
          report_id TEXT,
          version INTEGER DEFAULT 1,
          summary TEXT,
          diagnosis TEXT,
          objectives TEXT,
          adaptations TEXT,
          strategies TEXT,
          evaluation TEXT,
          timeline TEXT,
          status TEXT DEFAULT 'DRAFT',
          created_by TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id),
          FOREIGN KEY (report_id) REFERENCES reports(id),
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);

      // Tabla notifications
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          sender_id TEXT,
          read INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (sender_id) REFERENCES users(id)
        )
      `);

      // Tabla audio_files
      db.run(`
        CREATE TABLE IF NOT EXISTS audio_files (
          id TEXT PRIMARY KEY,
          pei_id TEXT,
          url TEXT NOT NULL,
          duration INTEGER,
          language TEXT DEFAULT 'es',
          voice TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (pei_id) REFERENCES peis(id)
        )
      `);

      // Tabla activity_logs
      db.run(`
        CREATE TABLE IF NOT EXISTS activity_logs (
          id TEXT PRIMARY KEY,
          action TEXT NOT NULL,
          entity TEXT NOT NULL,
          entity_id TEXT NOT NULL,
          user_id TEXT,
          details TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

// Insertar usuarios de prueba
const insertTestUsers = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const users = [
    {
      id: 'user-admin-001',
      email: 'admin@neuroplan.com',
      password: hashedPassword,
      role: 'ADMIN',
      first_name: 'Admin',
      last_name: 'NeuroPlan'
    },
    {
      id: 'user-orientador-001',
      email: 'orientador@neuroplan.com',
      password: hashedPassword,
      role: 'ORIENTADOR',
      first_name: 'Orientador',
      last_name: 'Test'
    },
    {
      id: 'user-profesor-001',
      email: 'profesor@neuroplan.com',
      password: hashedPassword,
      role: 'PROFESOR',
      first_name: 'Profesor',
      last_name: 'Test'
    }
  ];

  for (const user of users) {
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR REPLACE INTO users (id, email, password, role, first_name, last_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [user.id, user.email, user.password, user.role, user.first_name, user.last_name], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

// Insertar estudiante de prueba
const insertTestStudent = async () => {
  await new Promise((resolve, reject) => {
    db.run(`
      INSERT OR REPLACE INTO students (id, first_name, last_name, birth_date, grade, parent_name, parent_email, school, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'student-001',
      'Juan',
      'Pérez',
      '2010-05-15',
      '4º Primaria',
      'María Pérez',
      'maria.perez@email.com',
      'Colegio San José',
      'user-orientador-001'
    ], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Ejecutar setup
const setupDatabase = async () => {
  try {
    console.log('📋 Creando tablas...');
    await createTables();
    console.log('✅ Tablas creadas');

    console.log('👥 Insertando usuarios de prueba...');
    await insertTestUsers();
    console.log('✅ Usuarios insertados');

    console.log('🎓 Insertando estudiante de prueba...');
    await insertTestStudent();
    console.log('✅ Estudiante insertado');

    console.log('\n🎉 Base de datos SQLite configurada correctamente!');
    console.log('\n📊 Usuarios de prueba:');
    console.log('- admin@neuroplan.com / admin123 (ADMIN)');
    console.log('- orientador@neuroplan.com / admin123 (ORIENTADOR)');
    console.log('- profesor@neuroplan.com / admin123 (PROFESOR)');
    console.log('\n🎓 Estudiante de prueba: Juan Pérez (4º Primaria)');

  } catch (error) {
    console.error('❌ Error configurando base de datos:', error);
  } finally {
    db.close();
  }
};

setupDatabase();
