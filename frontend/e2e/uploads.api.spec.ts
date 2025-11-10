import { test, expect } from "@playwright/test";
import { getAuthToken } from "./helpers/auth";

const API_BASE_URL = "http://localhost:3001/api";

// NOTA: Usando e2e-test@neuroplan.com ya que admin@neuroplan.com tiene conflicto en Auth
// Usuario verificado funcional con fix-test-users-auth-v2.js
const ADMIN_USER = {
  email: "e2e-test@neuroplan.com",
  password: "E2eTest2024!",
};

test.describe("Uploads API E2E Tests", () => {
  let accessToken: string;

  test.beforeAll(async ({ request }) => {
    accessToken = await getAuthToken(
      request,
      ADMIN_USER.email,
      ADMIN_USER.password
    );
  });

  test.describe("Endpoint Protection", () => {
    test("should reject /uploads/test without authentication", async ({
      request,
    }) => {
      const response = await request.get(`${API_BASE_URL}/uploads/test`);

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.message).toBe("Unauthorized");
    });

    test("should allow /uploads/test with valid token", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/uploads/test`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      const data = body.data ?? body;
      expect(body.success).toBe(true);
      expect((data.message ?? body.message) as string).toContain("funcionando");
    });

    test("should reject /uploads/pdf-analysis without authentication", async ({
      request,
    }) => {
      const response = await request.post(
        `${API_BASE_URL}/uploads/pdf-analysis`
      );

      expect(response.status()).toBe(401);
    });

    test("should reject /uploads/models without authentication", async ({
      request,
    }) => {
      const response = await request.get(`${API_BASE_URL}/uploads/models`);

      expect(response.status()).toBe(401);
    });
  });

  test.describe("POST /uploads/test-pdf - Mock Analysis", () => {
    test("should return mock analysis without file", async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/uploads/test-pdf`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          analysisType: "diagnostico",
        },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      const data = body.data ?? body;

      expect(body.success).toBe(true);
      expect((data.message ?? body.message) as string).toContain("exitosamente");
      const analysisRoot = (data.analysis ?? body.analysis);
      expect(analysisRoot).toBeDefined();
      expect(analysisRoot.analysis).toHaveProperty("summary");
      expect(analysisRoot.analysis).toHaveProperty("recommendations");
      expect(analysisRoot.analysis).toHaveProperty("keyPoints");
      expect(analysisRoot.analysis).toHaveProperty("confidence");

      // Verificar estructura del análisis simulado
      expect(Array.isArray(body.analysis.analysis.recommendations)).toBe(true);
      expect(Array.isArray(body.analysis.analysis.keyPoints)).toBe(true);
      expect(body.analysis.analysis.recommendations.length).toBeGreaterThan(0);
      expect(body.analysis.analysis.keyPoints.length).toBeGreaterThan(0);
    });

    test("should use default analysis type when not provided", async ({
      request,
    }) => {
      const response = await request.post(`${API_BASE_URL}/uploads/test-pdf`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.analysis.analysisType).toBe("general");
    });
  });

  test.describe("POST /uploads/pdf-analysis - Real PDF Analysis", () => {
    test("should reject request without file", async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/uploads/pdf-analysis`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.message).toContain("archivo");
    });

    test("should reject non-PDF file", async ({ request }) => {
      // Crear un archivo de texto simulado
      const textContent = "This is not a PDF file";
      const blob = new Blob([textContent], { type: "text/plain" });

      const formData = new FormData();
      formData.append("file", blob, "test.txt");

      const response = await request.post(
        `${API_BASE_URL}/uploads/pdf-analysis`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          multipart: {
            file: {
              name: "test.txt",
              mimeType: "text/plain",
              buffer: Buffer.from(textContent),
            },
          },
        }
      );

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.message).toContain("PDF");
    });
  });

  test.describe("GET /uploads/models - List Ollama Models", () => {
    test("should list available models with authentication", async ({
      request,
    }) => {
      const response = await request.get(`${API_BASE_URL}/uploads/models`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.success).toBe(true);
      expect(body.models).toBeDefined();
      expect(Array.isArray(body.models)).toBe(true);
      expect(body.count).toBe(body.models.length);

      // Si Ollama está disponible y tiene modelos
      if (body.models.length > 0) {
        const model = body.models[0];
        // El backend puede devolver nombres como strings o objetos con 'name'
        if (typeof model === "string") {
          expect(model.length).toBeGreaterThan(0);
        } else {
          expect(model).toHaveProperty("name");
        }
      }
    });

    test("should reject without authentication", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/uploads/models`);

      expect(response.status()).toBe(401);
    });
  });

  test.describe("Rate Limiting on /uploads/pdf-analysis", () => {
    test.skip("should enforce rate limit of 5 requests per minute", async ({
      request,
    }) => {
      // Test deshabilitado temporalmente - rate limiting removido
      const requests = [];

      // Hacer 6 requests rápidas
      for (let i = 0; i < 6; i++) {
        const promise = request.post(`${API_BASE_URL}/uploads/pdf-analysis`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        requests.push(promise);
      }

      const responses = await Promise.all(requests);

      // Las primeras 5 deberían ser 400 (sin archivo)
      // La 6ta debería ser 429 (rate limit)
      const statuses = responses.map((r) => r.status());

      const rateLimitedCount = statuses.filter((s) => s === 429).length;
      const badRequestCount = statuses.filter((s) => s === 400).length;

      // Verificar que al menos una fue rate limited
      expect(rateLimitedCount).toBeGreaterThan(0);

      // Verificar que las que no fueron rate limited son 400 (sin archivo)
      expect(badRequestCount).toBeGreaterThan(0);

      // La última debería ser rate limited
      expect(responses[5].status()).toBe(429);

      const lastBody = await responses[5].json();
      expect(lastBody.message).toContain("Too Many Requests");
    });
  });

  test.describe("POST /uploads/generate-pdf-report - PDF Generation", () => {
    test("should generate PDF report with analysis data", async ({
      request,
    }) => {
      const analysisData = {
        studentName: "Juan Pérez Test",
        analysisDate: new Date().toISOString(),
        summary: "Resumen del análisis del estudiante",
        recommendations: [
          "Recomendación 1: Apoyo individualizado",
          "Recomendación 2: Adaptaciones curriculares",
        ],
        keyPoints: [
          "Punto clave 1: Fortalezas en lectura",
          "Punto clave 2: Necesita apoyo en matemáticas",
        ],
      };

      const response = await request.post(
        `${API_BASE_URL}/uploads/generate-pdf-report`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            analysisData,
          },
        }
      );

      // Puede devolver 200 (OK) o 201 (Created)
      expect([200, 201]).toContain(response.status());

      // Verificar headers de PDF
      const contentType = response.headers()["content-type"];
      const contentDisposition = response.headers()["content-disposition"];

      expect(contentType).toContain("application/pdf");
      expect(contentDisposition).toContain("attachment");
      expect(contentDisposition).toContain("analisis-");
      expect(contentDisposition).toContain(".pdf");

      // Verificar que hay contenido
      const buffer = await response.body();
      expect(buffer.length).toBeGreaterThan(0);

      // Verificar que empieza con el magic number de PDF
      const pdfHeader = buffer.slice(0, 4).toString();
      expect(pdfHeader).toBe("%PDF");
    });

    test("should reject generation without authentication", async ({
      request,
    }) => {
      const response = await request.post(
        `${API_BASE_URL}/uploads/generate-pdf-report`,
        {
          data: {
            analysisData: { test: "data" },
          },
        }
      );

      expect(response.status()).toBe(401);
    });

    test("should reject generation without analysis data", async ({
      request,
    }) => {
      const response = await request.post(
        `${API_BASE_URL}/uploads/generate-pdf-report`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(400);
    });
  });

  test.describe("Complete Upload Flow", () => {
    test("should complete mock analysis → generate PDF flow", async ({
      request,
    }) => {
      // 1. Generar análisis simulado
      const analysisResponse = await request.post(
        `${API_BASE_URL}/uploads/test-pdf`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            analysisType: "diagnostico",
          },
        }
      );

      expect(analysisResponse.status()).toBe(201);
      const analysisBody = await analysisResponse.json();
      expect(analysisBody.success).toBe(true);

      // 2. Usar el análisis para generar PDF
      const pdfResponse = await request.post(
        `${API_BASE_URL}/uploads/generate-pdf-report`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            analysisData: {
              studentName: "Estudiante E2E Test",
              analysisDate: new Date().toISOString(),
              ...((analysisBody.data ?? analysisBody).analysis.analysis),
            },
          },
        }
      );

      // Puede devolver 200 (OK) o 201 (Created)
      expect([200, 201]).toContain(pdfResponse.status());
      expect(pdfResponse.headers()["content-type"]).toContain(
        "application/pdf"
      );

      const buffer = await pdfResponse.body();
      expect(buffer.length).toBeGreaterThan(0);
    });
  });
});
