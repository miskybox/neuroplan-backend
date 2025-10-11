import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Crear estudiante demo
  const student = await prisma.student.create({
    data: {
      name: 'Ana',
      lastName: 'Pérez',
      birthDate: new Date('2015-05-20'),
      grade: '5º Primaria',
      parentName: 'Juan Pérez',
      parentEmail: 'juan.perez@example.com',
      parentPhone: '+34 600 123 456',
      school: 'CEIP Hackathon',
    }
  });

  // Crear informe demo
  const report = await prisma.report.create({
    data: {
      filename: 'informe-ana.pdf',
      originalName: 'Informe Ana.pdf',
      mimeType: 'application/pdf',
      size: 123456,
      path: '/uploads/informe-ana.pdf',
      extractedText: 'Diagnóstico: Dislexia. Síntomas: dificultad lectora.',
      status: 'COMPLETED',
      studentId: student.id,
    }
  });

  // Crear PEI demo
  await prisma.pEI.create({
    data: {
      version: 1,
      summary: 'PEI para Ana Pérez',
      diagnosis: 'Dislexia',
      objectives: '["Mejorar velocidad lectora", "Reducir errores ortográficos"]',
      adaptations: '{"lengua": "Tiempo extra", "matematicas": "Apoyos visuales"}',
      strategies: '["Método multisensorial", "Refuerzo positivo"]',
      evaluation: '{"preferente": "Oral"}',
      timeline: '{"revisión": "trimestral"}',
      status: 'ACTIVE',
      isActive: true,
      studentId: student.id,
      reportId: report.id,
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
