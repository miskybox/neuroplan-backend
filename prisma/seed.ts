import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // 1. Crear centro educativo de prueba
  const centro = await prisma.centro.upsert({
    where: { codigo: 'DEMO-001' },
    update: {},
    create: {
      nombre: 'Centro Educativo Demo',
      codigo: 'DEMO-001',
      ciudad: 'Barcelona',
      provincia: 'Barcelona',
      tipo: 'ESO',
      maxUsuarios: 100,
      activo: true,
    },
  });
  console.log('✅ Centro creado:', centro.nombre);

  // 2. Crear usuario system
  const systemPassword = await bcrypt.hash('SystemPass123!', 10);
  const systemUser = await prisma.usuario.upsert({
    where: { email: 'system@neuroplan.ai' },
    update: {},
    create: {
      email: 'system@neuroplan.ai',
      password: systemPassword,
      nombre: 'System',
      apellidos: 'Administrator',
      rol: 'ADMIN',
      centroId: centro.id,
      activo: true,
    },
  });
  console.log('✅ Usuario system creado:', systemUser.email);
  console.log('✅ Usuario system creado');

  // 3. Crear usuario ADMIN
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: adminPassword,
      nombre: 'Admin',
      apellidos: 'Demo',
      rol: 'ADMIN',
      centroId: centro.id,
      activo: true,
    },
  });
  console.log('✅ Admin creado:', admin.email);

  // 4. Crear usuario ORIENTADOR
  const orientadorPassword = await bcrypt.hash('Orientador123!', 10);
  const orientador = await prisma.usuario.upsert({
    where: { email: 'orientador@demo.com' },
    update: {},
    create: {
      email: 'orientador@demo.com',
      password: orientadorPassword,
      nombre: 'María',
      apellidos: 'González',
      rol: 'ORIENTADOR',
      centroId: centro.id,
      activo: true,
    },
  });
  console.log('✅ Orientador creado:', orientador.email);

  // 5. Crear usuario PROFESOR
  const profesorPassword = await bcrypt.hash('Profesor123!', 10);
  const profesor = await prisma.usuario.upsert({
    where: { email: 'profesor@demo.com' },
    update: {},
    create: {
      email: 'profesor@demo.com',
      password: profesorPassword,
      nombre: 'Juan',
      apellidos: 'Martínez',
      rol: 'PROFESOR',
      centroId: centro.id,
      asignaturas: JSON.stringify(['Matemáticas', 'Física']),
      activo: true,
    },
  });
  console.log('✅ Profesor creado:', profesor.email);

  // 6. Crear usuario familia de prueba
  const familiaPassword = await bcrypt.hash('demo123', 10);
  const familia = await prisma.usuario.upsert({
    where: { email: 'familia@demo.com' },
    update: {},
    create: {
      email: 'familia@demo.com',
      password: familiaPassword,
      nombre: 'María',
      apellidos: 'López García',
      rol: 'FAMILIA',
      centroId: centro.id,
      activo: true,
    },
  });
  console.log('✅ Usuario familia creado:', familia.email);

  // 7. Crear estudiante de prueba
  const estudiante = await prisma.student.upsert({
    where: { id: 'demo-student-001' },
    update: {},
    create: {
      id: 'demo-student-001',
      nombre: 'Carlos',
      apellidos: 'Rodríguez Pérez',
      fechaNacimiento: new Date('2012-05-15'),
      curso: '1º ESO',
      diagnosticos: JSON.stringify(['TDAH', 'Dislexia']),
      estiloAprendizaje: 'VISUAL',
      nombreTutor: 'María López García',
      emailTutor: 'familia@demo.com',
      telefonoTutor: '+34666123456',
      usuarioFamiliaId: familia.id, // Asociar con usuario familia
      centroId: centro.id,
      consentimientoRGPD: true,
      consentimientoIA: true,
    },
  });
  console.log('✅ Estudiante creado:', estudiante.nombre, estudiante.apellidos);

  console.log('\n🎉 Seed completado exitosamente!\n');
  console.log('📝 Credenciales de acceso:');
  console.log('   Admin: admin@demo.com / Admin123!');
  console.log('   Orientador: orientador@demo.com / Orientador123!');
  console.log('   Profesor: profesor@demo.com / Profesor123!');
  console.log('   System: system@neuroplan.ai / SystemPass123!');
}

try {
  await main();
} catch (e) {
  console.error('❌ Error en seed:', e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
