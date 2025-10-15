/*
  Warnings:

  - You are about to drop the column `action` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entity` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `adaptations` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `approvedAt` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosis` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `objectives` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `reviewDate` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `strategies` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `timeline` on the `peis` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `parentEmail` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `parentName` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `parentPhone` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `audio_files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resource_links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workflow_executions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accion` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entidad` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entidadId` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adaptaciones` to the `peis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creadoPorId` to the `peis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cronograma` to the `peis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diagnostico` to the `peis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estrategias` to the `peis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluacion` to the `peis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objetivos` to the `peis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resumen` to the `peis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellidos` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `centroId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `curso` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaNacimiento` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "audio_files" DROP CONSTRAINT "audio_files_peiId_fkey";

-- DropForeignKey
ALTER TABLE "resource_links" DROP CONSTRAINT "resource_links_peiId_fkey";

-- DropForeignKey
ALTER TABLE "workflow_executions" DROP CONSTRAINT "workflow_executions_peiId_fkey";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "action",
DROP COLUMN "details",
DROP COLUMN "entity",
DROP COLUMN "entityId",
ADD COLUMN     "accion" TEXT NOT NULL,
ADD COLUMN     "detalles" TEXT,
ADD COLUMN     "entidad" TEXT NOT NULL,
ADD COLUMN     "entidadId" TEXT NOT NULL,
ADD COLUMN     "peiId" TEXT,
ADD COLUMN     "usuarioId" TEXT;

-- AlterTable
ALTER TABLE "peis" DROP COLUMN "adaptations",
DROP COLUMN "approvedAt",
DROP COLUMN "approvedBy",
DROP COLUMN "diagnosis",
DROP COLUMN "evaluation",
DROP COLUMN "isActive",
DROP COLUMN "objectives",
DROP COLUMN "reviewDate",
DROP COLUMN "status",
DROP COLUMN "strategies",
DROP COLUMN "summary",
DROP COLUMN "timeline",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "adaptaciones" TEXT NOT NULL,
ADD COLUMN     "aprobadoPorId" TEXT,
ADD COLUMN     "creadoPorId" TEXT NOT NULL,
ADD COLUMN     "cronograma" TEXT NOT NULL,
ADD COLUMN     "diagnostico" TEXT NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
ADD COLUMN     "estrategias" TEXT NOT NULL,
ADD COLUMN     "evaluacion" TEXT NOT NULL,
ADD COLUMN     "fechaAprobacion" TIMESTAMP(3),
ADD COLUMN     "fechaRevision" TIMESTAMP(3),
ADD COLUMN     "objetivos" TEXT NOT NULL,
ADD COLUMN     "resumen" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "birthDate",
DROP COLUMN "grade",
DROP COLUMN "lastName",
DROP COLUMN "name",
DROP COLUMN "parentEmail",
DROP COLUMN "parentName",
DROP COLUMN "parentPhone",
DROP COLUMN "school",
ADD COLUMN     "apellidos" TEXT NOT NULL,
ADD COLUMN     "centroId" TEXT NOT NULL,
ADD COLUMN     "consentimientoIA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentimientoRGPD" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "curso" TEXT NOT NULL,
ADD COLUMN     "diagnosticos" TEXT,
ADD COLUMN     "emailTutor" TEXT,
ADD COLUMN     "estiloAprendizaje" TEXT,
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "nombreTutor" TEXT,
ADD COLUMN     "telefonoTutor" TEXT;

-- DropTable
DROP TABLE "audio_files";

-- DropTable
DROP TABLE "resource_links";

-- DropTable
DROP TABLE "workflow_executions";

-- CreateTable
CREATE TABLE "centros" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "maxUsuarios" INTEGER NOT NULL DEFAULT 100,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "centros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "centroId" TEXT NOT NULL,
    "asignaturas" TEXT,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temarios" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "asignatura" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "archivos" TEXT,
    "creditosLOMLOE" TEXT,
    "competencias" TEXT,
    "centroId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materiales_adaptados" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "recursos" TEXT,
    "nivelAdaptacion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "peiId" TEXT NOT NULL,
    "temarioId" TEXT,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "materiales_adaptados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passport_entries" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "verificadoPor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "passport_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "centros_codigo_key" ON "centros"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_centroId_idx" ON "usuarios"("centroId");

-- CreateIndex
CREATE INDEX "temarios_centroId_idx" ON "temarios"("centroId");

-- CreateIndex
CREATE INDEX "materiales_adaptados_peiId_idx" ON "materiales_adaptados"("peiId");

-- CreateIndex
CREATE INDEX "materiales_adaptados_studentId_idx" ON "materiales_adaptados"("studentId");

-- CreateIndex
CREATE INDEX "passport_entries_studentId_idx" ON "passport_entries"("studentId");

-- CreateIndex
CREATE INDEX "activity_logs_usuarioId_idx" ON "activity_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "activity_logs_entidad_entidadId_idx" ON "activity_logs"("entidad", "entidadId");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- CreateIndex
CREATE INDEX "peis_studentId_idx" ON "peis"("studentId");

-- CreateIndex
CREATE INDEX "peis_creadoPorId_idx" ON "peis"("creadoPorId");

-- CreateIndex
CREATE INDEX "reports_studentId_idx" ON "reports"("studentId");

-- CreateIndex
CREATE INDEX "students_centroId_idx" ON "students"("centroId");

-- CreateIndex
CREATE INDEX "students_emailTutor_idx" ON "students"("emailTutor");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_centroId_fkey" FOREIGN KEY ("centroId") REFERENCES "centros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temarios" ADD CONSTRAINT "temarios_centroId_fkey" FOREIGN KEY ("centroId") REFERENCES "centros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_centroId_fkey" FOREIGN KEY ("centroId") REFERENCES "centros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peis" ADD CONSTRAINT "peis_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peis" ADD CONSTRAINT "peis_aprobadoPorId_fkey" FOREIGN KEY ("aprobadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiales_adaptados" ADD CONSTRAINT "materiales_adaptados_peiId_fkey" FOREIGN KEY ("peiId") REFERENCES "peis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiales_adaptados" ADD CONSTRAINT "materiales_adaptados_temarioId_fkey" FOREIGN KEY ("temarioId") REFERENCES "temarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiales_adaptados" ADD CONSTRAINT "materiales_adaptados_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passport_entries" ADD CONSTRAINT "passport_entries_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_peiId_fkey" FOREIGN KEY ("peiId") REFERENCES "peis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
