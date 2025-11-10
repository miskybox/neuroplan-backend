import { test, expect } from "@playwright/test";

const API_URL = process.env.VITE_API_URL || "http://localhost:3001/api";

test.describe("Complete User Flow - E2E", () => {
  let adminToken: string;
  let studentId: string;
  let peiId: string;

  test.beforeAll(async ({ request }) => {
    // Login como admin
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: "admin@test.com",
        password: "Test123456!",
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    adminToken = data.data.accessToken;
    expect(adminToken).toBeTruthy();
  });

  test("1. Should register a new user", async ({ request }) => {
    const timestamp = Date.now();
    const response = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `playwright.test.${timestamp}@example.com`,
        password: "Test123456!",
        nombre: "Playwright",
        apellidos: "Test User",
        rol: "PROFESOR",
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.data).toHaveProperty("user");
    expect(data.data.user.email).toContain("playwright.test");
  });

  test("2. Should login successfully", async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: "admin@test.com",
        password: "Test123456!",
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.data).toHaveProperty("accessToken");
    expect(data.data.accessToken).toBeTruthy();
  });

  test("3. Should create a student", async ({ request }) => {
    const response = await request.post(`${API_URL}/students`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      data: {
        nombre: "Juan Playwright",
        apellidos: "Test Student",
        fecha_nacimiento: "2010-05-15",
        nivel_educativo: "Primaria",
        curso: "4º",
        diagnostico: "TDAH",
        necesidades_educativas: ["Atención individualizada", "Tiempo extra"],
      },
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    studentId = data.data.id;
    expect(studentId).toBeTruthy();
  });

  test("4. Should read created student", async ({ request }) => {
    expect(studentId).toBeTruthy();

    const response = await request.get(`${API_URL}/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.data.nombre).toBe("Juan Playwright");
    expect(data.data.diagnostico).toBe("TDAH");
  });

  test("5. Should update student", async ({ request }) => {
    expect(studentId).toBeTruthy();

    const response = await request.put(`${API_URL}/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      data: {
        nombre: "Juan Playwright",
        apellidos: "Test Student Updated",
        fecha_nacimiento: "2010-05-15",
        nivel_educativo: "Primaria",
        curso: "5º", // Cambiado
        diagnostico: "TDAH",
        necesidades_educativas: ["Atención individualizada", "Tiempo extra"],
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.data.curso).toBe("5º");
  });

  test("6. Should list all students", async ({ request }) => {
    const response = await request.get(`${API_URL}/students`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
  });

  test("7. Should generate a PEI for the student", async ({ request }) => {
    expect(studentId).toBeTruthy();

    const response = await request.post(`${API_URL}/peis/generate`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      data: {
        studentId,
        diagnostico: "TDAH",
        nivel_educativo: "5º Primaria",
        objetivos: [
          "Mejorar la atención en clase",
          "Desarrollar estrategias de organización",
        ],
        adaptaciones: ["Tiempo extra en exámenes", "Instrucciones por escrito"],
      },
    });

    expect([200, 201]).toContain(response.status());
    const data = await response.json();
    peiId = data.data.id;
    expect(peiId).toBeTruthy();
  });

  test("8. Should retrieve the generated PEI", async ({ request }) => {
    expect(peiId).toBeTruthy();

    const response = await request.get(`${API_URL}/peis/${peiId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.data.id).toBe(peiId);
    expect(data.data.student_id).toBe(studentId);
  });

  test("9. Should list PEIs for the student", async ({ request }) => {
    expect(studentId).toBeTruthy();

    const response = await request.get(`${API_URL}/peis/student/${studentId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
  });

  test("10. Should check Ollama models", async ({ request }) => {
    const response = await request.get(`${API_URL}/uploads/models`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    // No falla si Ollama no está disponible
    if (response.ok()) {
      const data = await response.json();
      expect(Array.isArray(data.data)).toBeTruthy();
    }
  });

  test("11. Should verify health endpoint", async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status || data.data?.status).toBeTruthy();
  });

  test.afterAll(async ({ request }) => {
    // Cleanup: Delete test student
    if (studentId) {
      await request.delete(`${API_URL}/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
    }
  });
});

test.describe("Authorization and Permissions", () => {
  let adminToken: string;
  let profesorToken: string;

  test.beforeAll(async ({ request }) => {
    // Login admin
    const adminResponse = await request.post(`${API_URL}/auth/login`, {
      data: { email: "admin@test.com", password: "Test123456!" },
    });
    const adminData = await adminResponse.json();
    adminToken = adminData.data.accessToken;

    // Login profesor
    const profesorResponse = await request.post(`${API_URL}/auth/login`, {
      data: { email: "profesor@test.com", password: "Test123456!" },
    });
    const profesorData = await profesorResponse.json();
    profesorToken = profesorData.data.accessToken;
  });

  test("Admin should access dashboard", async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
  });

  test("Profesor should access their profile", async ({ request }) => {
    const response = await request.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${profesorToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.data.rol).toBe("PROFESOR");
  });

  test("Unauthorized request should fail", async ({ request }) => {
    const response = await request.get(`${API_URL}/students`);

    expect(response.status()).toBe(401);
  });

  test("Invalid token should fail", async ({ request }) => {
    const response = await request.get(`${API_URL}/students`, {
      headers: {
        Authorization: "Bearer invalid-token-12345",
      },
    });

    expect(response.status()).toBe(401);
  });
});
