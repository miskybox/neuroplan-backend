const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const pdfPath = path.join(__dirname, "test.pdf");

// Crear PDF
const doc = new PDFDocument();
const stream = fs.createWriteStream(pdfPath);

doc.pipe(stream);

// Contenido del PDF
doc
  .fontSize(18)
  .text("Plan Educativo Individualizado (PEI)", { align: "center" });
doc.moveDown();

doc.fontSize(14).text("Datos del Estudiante");
doc.fontSize(11);
doc.text("Nombre: Juan Perez Gomez");
doc.text("Edad: 8 anos");
doc.text("Curso: Tercero de Primaria");
doc.text("Centro: Colegio Example");
doc.moveDown();

doc.fontSize(14).text("Necesidades Especiales");
doc.fontSize(11);
doc.list([
  "Dificultades en lectoescritura y comprension lectora",
  "Requiere apoyo individualizado en matematicas basicas",
  "Necesita refuerzo en atencion y concentracion",
  "Beneficiario de adaptaciones curriculares",
]);
doc.moveDown();

doc.fontSize(14).text("Fortalezas Identificadas");
doc.fontSize(11);
doc.list([
  "Excelente memoria visual y capacidad de retencion",
  "Buena disposicion al aprendizaje y alta motivacion",
  "Habilidad para trabajar en equipo y cooperar",
  "Creatividad en actividades artisticas",
]);
doc.moveDown();

doc.fontSize(14).text("Objetivos del Plan");
doc.fontSize(11);
doc.list([
  "Mejorar la comprension lectora en un 30 por ciento",
  "Desarrollar estrategias de calculo mental",
  "Aumentar el tiempo de concentracion en tareas academicas",
  "Fomentar la autonomia en el aprendizaje",
]);

doc.end();

// Esperar a que termine
stream.on("finish", async () => {
  console.log("✅ PDF creado:", pdfPath);

  // Verificar con pdf-parse
  try {
    const pdfParse = require("./backend/node_modules/pdf-parse");
    const buffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(buffer);
    console.log("✅ Texto extraíble:", data.text.length, "caracteres");
    console.log("\nPrimeros 200 caracteres:");
    console.log(data.text.substring(0, 200));
  } catch (err) {
    console.error("❌ Error verificando PDF:", err.message);
  }
});

stream.on("error", (err) => {
  console.error("❌ Error creando PDF:", err);
});
