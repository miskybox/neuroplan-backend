const axios = require("axios");
const FormData = require("form-data");
const fs = require("node:fs");
const path = require("node:path");

const API_URL = "http://localhost:3001/api";

// Configurar timeout largo para análisis con Ollama
axios.defaults.timeout = 120000; // 2 minutos

async function testCompleteFlow() {
  console.log("\n🧪 INICIANDO PRUEBAS COMPLETAS\n");
  console.log("=".repeat(50));

  try {
    // PASO 1: Verificar Health
    console.log("\n📊 PASO 1: Verificando Health...");
    const health = await axios.get(`${API_URL}/health`);
    console.log("✅ Health OK:", health.data);

    // PASO 2: Login
    console.log("\n🔐 PASO 2: Login con admin@test.com...");
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: "admin@test.com",
      password: "Test123456!",
    });

    const token =
      loginResponse.data.data?.accessToken ||
      loginResponse.data.data?.access_token ||
      loginResponse.data.accessToken;
    if (!token) {
      console.log(
        "   Respuesta completa:",
        JSON.stringify(loginResponse.data, null, 2)
      );
      throw new Error("No se recibió token en la respuesta");
    }
    console.log("✅ Login exitoso");
    console.log("   Token:", token.substring(0, 20) + "...");
    console.log("   Usuario:", loginResponse.data.data?.user?.email || "N/A");
    console.log("   Rol:", loginResponse.data.data?.user?.role || "N/A");

    // PASO 3: Verificar /auth/me
    console.log("\n👤 PASO 3: Verificando perfil...");
    const meResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = meResponse.data.data;
    console.log("✅ Perfil OK:", user.email, `(${user.role})`);

    // PASO 4: Verificar PDF de prueba
    console.log("\n📄 PASO 4: Verificando PDF de prueba...");
    const pdfPath = path.join(__dirname, "test.pdf");
    if (!fs.existsSync(pdfPath)) {
      throw new Error("No existe test.pdf - debe crearse primero");
    }
    console.log("✅ PDF encontrado:", pdfPath);

    // PASO 5: Analizar PDF con autenticación
    console.log("\n🤖 PASO 5: Analizando PDF con Ollama...");
    const formData = new FormData();
    formData.append("file", fs.createReadStream(pdfPath), {
      filename: "test.pdf",
      contentType: "application/pdf",
    });
    formData.append("analysisType", "educational");

    const analysisResponse = await axios.post(
      `${API_URL}/uploads/pdf-analysis`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Análisis completado");
    console.log("   Éxito:", analysisResponse.data.success);
    console.log("   Mensaje:", analysisResponse.data.message);
    console.log(
      "   Resumen:",
      analysisResponse.data.analysis?.analysis?.summary?.substring(0, 100) +
        "..."
    );
    console.log(
      "   Recomendaciones:",
      analysisResponse.data.analysis?.analysis?.recommendations?.length || 0
    );
    console.log(
      "   Confianza:",
      analysisResponse.data.analysis?.analysis?.confidence || "N/A"
    );
    console.log(
      "   Fallback:",
      analysisResponse.data.analysis?.analysis?.fallback || false
    );

    // PASO 6: Verificar modelos de Ollama
    console.log("\n🤖 PASO 6: Verificando modelos de Ollama...");
    const modelsResponse = await axios.get(`${API_URL}/uploads/models`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Modelos disponibles:", modelsResponse.data.models);

    console.log("\n" + "=".repeat(50));
    console.log("✅ TODAS LAS PRUEBAS PASARON");
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("\n❌ ERROR:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);
    process.exit(1);
  }
}

testCompleteFlow();
