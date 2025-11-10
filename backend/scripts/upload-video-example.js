/**
 * Script de ejemplo para subir videos a api.video
 *
 * Uso:
 *   node upload-video-example.js ruta/al/video.mp4
 *
 * Requiere:
 *   npm install @api.video/nodejs-client
 */

const ApiVideoClient = require("@api.video/nodejs-client").default;
const fs = require("node:fs");
const path = require("path");

// Configuración desde .env
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const API_VIDEO_URL = process.env.API_VIDEO_URL || "https://sandbox.api.video";
const API_VIDEO_KEY = process.env.API_VIDEO_KEY;

if (!API_VIDEO_KEY) {
  console.error("❌ Error: API_VIDEO_KEY no configurada en .env");
  process.exit(1);
}

// Inicializar cliente
const client = new ApiVideoClient({
  apiKey: API_VIDEO_KEY,
  baseUri: API_VIDEO_URL,
});

/**
 * Subir video con metadata educativa
 */
async function uploadVideo(filePath, metadata) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }

    console.log(`📹 Creando video en api.video...`);

    // Crear video con metadata
    const video = await client.videos.create({
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags,
      metadata: {
        instructor: metadata.instructor,
      },
    });

    console.log(`✅ Video creado: ${video.videoId}`);
    console.log(`📊 Subiendo archivo: ${path.basename(filePath)}`);

    // Subir archivo
    const uploadedVideo = await client.videos.upload(video.videoId, filePath);

    console.log(`\n✅ Video subido exitosamente!`);
    console.log(`📹 ID: ${uploadedVideo.videoId}`);
    console.log(`🔗 URL: ${uploadedVideo.assets.mp4}`);
    console.log(`🖼️  Thumbnail: ${uploadedVideo.assets.thumbnail}`);
    console.log(`⏱️  Duración: ${uploadedVideo.duration}s`);

    return uploadedVideo;
  } catch (error) {
    console.error("❌ Error subiendo video:", error.message);
    throw error;
  }
}

/**
 * Listar videos existentes
 */
async function listVideos() {
  try {
    console.log("📋 Listando videos...\n");

    const videos = await client.videos.list();

    if (videos.data.length === 0) {
      console.log("No hay videos aún. Sube uno con este script!");
      return;
    }

    videos.data.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title || "Sin título"}`);
      console.log(`   ID: ${video.videoId}`);
      console.log(`   Tags: ${video.tags?.join(", ") || "Sin tags"}`);
      console.log(`   Duración: ${video.duration}s`);
      console.log(`   Vistas: ${video.stats?.views || 0}`);
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error listando videos:", error.message);
  }
}

// ==============================================
// Ejemplos de uso
// ==============================================

const ejemplos = {
  matematicas: {
    title: "Introducción a las Ecuaciones de Segundo Grado",
    description:
      "Aprende los conceptos básicos de las ecuaciones cuadráticas con ejemplos prácticos",
    tags: [
      "subject:Matemáticas",
      "level:ESO",
      "year:3º ESO",
      "ecuaciones",
      "álgebra",
      "segundo grado",
    ],
    instructor: "Prof. Ana Martínez",
  },

  historia: {
    title: "Historia de España: Siglo XX",
    description:
      "Repaso completo de los acontecimientos más importantes del siglo XX en España",
    tags: [
      "subject:Historia",
      "level:Bachillerato",
      "year:2º Bachillerato",
      "españa",
      "siglo xx",
      "guerra civil",
    ],
    instructor: "Prof. Carlos López",
  },

  ciencias: {
    title: "Fotosíntesis: Proceso Vital",
    description:
      "Explicación detallada del proceso de fotosíntesis en las plantas",
    tags: [
      "subject:Ciencias",
      "level:ESO",
      "year:2º ESO",
      "fotosíntesis",
      "plantas",
      "biología",
    ],
    instructor: "Prof. María García",
  },
};

// CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === "list") {
  listVideos();
} else if (command === "upload" && args[1]) {
  const filePath = args[1];
  const materia = args[2] || "matematicas"; // default

  if (!ejemplos[materia]) {
    console.error(`❌ Materia no reconocida: ${materia}`);
    console.log(`Materias disponibles: ${Object.keys(ejemplos).join(", ")}`);
    process.exit(1);
  }

  uploadVideo(filePath, ejemplos[materia]);
} else {
  console.log(`
📹 Script de Upload a api.video

Uso:
  node upload-video-example.js list
    Lista todos los videos existentes
  
  node upload-video-example.js upload <archivo> [materia]
    Sube un video con metadata educativa
    
    Materias disponibles:
    - matematicas (default)
    - historia
    - ciencias
    
Ejemplos:
  node upload-video-example.js list
  node upload-video-example.js upload video.mp4 matematicas
  node upload-video-example.js upload tutorial.mp4 historia

Configuración:
  Asegúrate de tener API_VIDEO_KEY en backend/.env
  `);
}

module.exports = { uploadVideo, listVideos };
