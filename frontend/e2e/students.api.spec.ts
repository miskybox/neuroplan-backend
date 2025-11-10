import { test, expect } from "@playwright/test";
import { getAuthToken } from "./helpers/auth";

const API_BASE_URL = "http://localhost:3001/api";

// NOTA: Usando e2e-test@neuroplan.com ya que admin@neuroplan.com tiene conflicto en Auth
// Usuario verificado funcional con fix-test-users-auth-v2.js
const ADMIN_USER = {
  email: "e2e-test@neuroplan.com",
  password: "E2eTest2024!",
};

const TEST_STUDENT = {
  first_name: "Juan",
  last_name: "Pérez García",
  birth_date: "2015-03-15",
  grade: "5º Primaria",
  parent_name: "María García",
  parent_email: "maria.garcia@test.com",
  parent_phone: "+34612345678",
  school: "CEIP Miguel de Cervantes",
};

test.describe("Students API E2E Tests", () => {
  let accessToken: string;

  // Obtener token una sola vez y reutilizarlo
  test.beforeAll(async ({ request }) => {
    accessToken = await getAuthToken(
      request,
      ADMIN_USER.email,
      ADMIN_USER.password
    );
  });

  test.describe("POST /students - Create Student", () => {
    test("should create a new student successfully", async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          ...TEST_STUDENT,
          first_name: `${TEST_STUDENT.first_name} ${Date.now()}`, // Hacer único
        },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      const data = body.data ?? body;

      expect(body.success).toBe(true);
      expect(body.message).toContain("creado");
      expect(data).toBeDefined();
      expect(data.first_name).toContain(TEST_STUDENT.first_name);
      expect(data.last_name).toBe(TEST_STUDENT.last_name);
      // Nota: grade, parent_email ya no existen en esquema normalizado
      // Se mantienen en el DTO pero no se guardan en la BD
    });

    test("should reject creation without authentication", async ({
      request,
    }) => {
      const response = await request.post(`${API_BASE_URL}/students`, {
        data: TEST_STUDENT,
      });

      expect(response.status()).toBe(401);
    });

    test("should reject creation with invalid token", async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: "Bearer invalid-token",
        },
        data: TEST_STUDENT,
      });

      expect(response.status()).toBe(401);
    });

    test("should reject creation without required fields", async ({
      request,
    }) => {
      const response = await request.post(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          // Faltan 'first_name' y 'last_name' que son requeridos
          parent_email: "test@test.com",
        },
      });

      expect(response.status()).toBe(400);
    });

    test("should create student with only required fields", async ({
      request,
    }) => {
      const response = await request.post(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          first_name: `Minimal`,
          last_name: `Student ${Date.now()}`,
        },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      const data = body.data ?? body;
      expect(body.success).toBe(true);
      expect(data.first_name).toBeDefined();
      expect(data.last_name).toBeDefined();
    });
  });

  test.describe("GET /students - List Students", () => {
    test("should list all students for authenticated user", async ({
      request,
    }) => {
      const response = await request.get(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      const data = body.data ?? body;

      expect(body.success).toBe(true);
      expect(data.students).toBeDefined();
      expect(Array.isArray(data.students)).toBe(true);
      expect(data.count).toBe(data.students.length);

      // Si hay estudiantes, verificar estructura
      if (body.students.length > 0) {
        const student = body.students[0];
        expect(student).toHaveProperty("id");
        expect(student).toHaveProperty("first_name");
        expect(student).toHaveProperty("last_name");
      }
    });

    test("should reject request without authentication", async ({
      request,
    }) => {
      const response = await request.get(`${API_BASE_URL}/students`);

      expect(response.status()).toBe(401);
    });

    test("should return empty array if user has no students", async ({
      request,
    }) => {
      // Crear un nuevo usuario que no tiene estudiantes
      const newUserEmail = `newuser-${Date.now()}@test.com`;

      // Registrar nuevo usuario
      await request.post(`${API_BASE_URL}/auth/register`, {
        data: {
          email: newUserEmail,
          password: "NewUser2024!",
          firstName: "New",
          lastName: "User",
          role: "ORIENTADOR",
          centerId: "d863f99c-5a75-4e4d-8cb9-8f12c64eacac",
        },
      });

      // Login con nuevo usuario
      const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
        data: {
          email: newUserEmail,
          password: "NewUser2024!",
        },
      });

      const { accessToken: newToken } = await loginResponse.json();

      // Listar estudiantes (debería estar vacío)
      const studentsResponse = await request.get(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      expect(studentsResponse.status()).toBe(200);
      const body = await studentsResponse.json();
      const data = body.data ?? body;
      expect(data.students).toEqual([]);
      expect(data.count).toBe(0);
    });
  });

  test.describe("GET /students/:id - Get Student by ID", () => {
    let testStudentId: string;

    test.beforeAll(async ({ request }) => {
      // Crear un estudiante para estos tests
      const response = await request.post(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          ...TEST_STUDENT,
          first_name: `Get Test ${Date.now()}`,
        },
      });
      const body = await response.json();
      const data = body.data ?? body;
      testStudentId = data.id;
    });

    test("should get student by id successfully", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/students/${testStudentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      const data = body.data ?? body;

      expect(body.success).toBe(true);
      expect(data).toBeDefined();
      expect(data.id).toBe(testStudentId);
      expect(data.first_name).toBeDefined();
      expect(data.last_name).toBeDefined();
    });

    test("should reject request without authentication", async ({
      request,
    }) => {
      const response = await request.get(
        `${API_BASE_URL}/students/${testStudentId}`
      );

      expect(response.status()).toBe(401);
    });

    test("should return 404 for non-existent student", async ({ request }) => {
      const fakeId = "99999999-9999-9999-9999-999999999999";

      const response = await request.get(`${API_BASE_URL}/students/${fakeId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // UUID válido pero no existe puede devolver 400 o 404
      expect([400, 404]).toContain(response.status());
    });
  });

  test.describe("PUT /students/:id - Update Student", () => {
    let updateStudentId: string;

    test.beforeAll(async ({ request }) => {
      // Crear estudiante para actualizar
      const response = await request.post(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          ...TEST_STUDENT,
          first_name: `Update Test ${Date.now()}`,
        },
      });
      const body = await response.json();
      updateStudentId = body.student.id;
    });

    test("should update student successfully", async ({ request }) => {
      const updatedData = {
        first_name: "Juan",
        last_name: "Pérez García ACTUALIZADO",
        grade: "6º Primaria",
        school: "CEIP Ramón y Cajal",
      };

      const response = await request.put(
        `${API_BASE_URL}/students/${updateStudentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: updatedData,
        }
      );

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.success).toBe(true);
      expect(body.message).toContain("actualizado");
      expect(body.student.first_name).toBe(updatedData.first_name);
      expect(body.student.last_name).toBe(updatedData.last_name);
      // Nota: grade ya no existe en esquema normalizado
    });

    test("should reject update without authentication", async ({ request }) => {
      const response = await request.put(
        `${API_BASE_URL}/students/${updateStudentId}`,
        {
          data: { first_name: "Updated Name" },
        }
      );

      expect(response.status()).toBe(401);
    });

    test("should return 404 when updating non-existent student", async ({
      request,
    }) => {
      const fakeId = "99999999-9999-9999-9999-999999999999";

      const response = await request.put(`${API_BASE_URL}/students/${fakeId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { name: "Updated Name" },
      });

      expect(response.status()).toBe(404);
    });
  });

  test.describe("DELETE /students/:id - Delete Student", () => {
    let deleteStudentId: string;

    test.beforeEach(async ({ request }) => {
      // Crear nuevo estudiante para cada test de eliminación
      const response = await request.post(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          ...TEST_STUDENT,
          first_name: `Delete Test ${Date.now()}`,
        },
      });
      const body = await response.json();
      deleteStudentId = body.student.id;
    });

    test("should delete student successfully", async ({ request }) => {
      const response = await request.delete(
        `${API_BASE_URL}/students/${deleteStudentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.success).toBe(true);
      expect(body.message).toContain("eliminado");

      // Verificar que ya no existe
      const getResponse = await request.get(
        `${API_BASE_URL}/students/${deleteStudentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Estudiante eliminado puede devolver 400 o 404
      expect([400, 404]).toContain(getResponse.status());
    });

    test("should reject delete without authentication", async ({ request }) => {
      const response = await request.delete(
        `${API_BASE_URL}/students/${deleteStudentId}`
      );

      expect(response.status()).toBe(401);
    });

    test("should return 404 when deleting non-existent student", async ({
      request,
    }) => {
      const fakeId = "99999999-9999-9999-9999-999999999999";

      const response = await request.delete(
        `${API_BASE_URL}/students/${fakeId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      expect(response.status()).toBe(404);
    });
  });

  test.describe("Complete CRUD Flow", () => {
    test("should complete full CRUD lifecycle for a student", async ({
      request,
    }) => {
      const studentFirstName = `Full CRUD ${Date.now()}`;

      // 1. CREATE
      const createResponse = await request.post(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          ...TEST_STUDENT,
          first_name: studentFirstName,
        },
      });

      expect(createResponse.status()).toBe(201);
      const createBody = await createResponse.json();
      const studentId = createBody.student.id;
      expect(createBody.student.first_name).toBe(studentFirstName);

      // 2. READ (Get by ID)
      const getResponse = await request.get(
        `${API_BASE_URL}/students/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      expect(getResponse.status()).toBe(200);
      const getBody = await getResponse.json();
      const getData = getBody.data ?? getBody;
      expect(getData.id).toBe(studentId);

      // 3. UPDATE
      const updatedLastName = `${TEST_STUDENT.last_name} UPDATED`;
      const updateResponse = await request.put(
        `${API_BASE_URL}/students/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            first_name: studentFirstName,
            last_name: updatedLastName,
            grade: "6º Primaria",
          },
        }
      );

      expect(updateResponse.status()).toBe(200);
      const updateBody = await updateResponse.json();
      const updateData = updateBody.data ?? updateBody;
      expect(updateData.first_name).toBe(studentFirstName);
      expect(updateData.last_name).toBe(updatedLastName);
      // Nota: grade ya no existe en esquema normalizado

      // 4. DELETE
      const deleteResponse = await request.delete(
        `${API_BASE_URL}/students/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      expect(deleteResponse.status()).toBe(200);

      // 5. VERIFY DELETION
      const verifyResponse = await request.get(
        `${API_BASE_URL}/students/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Estudiante eliminado puede devolver 400 o 404
      expect([400, 404]).toContain(verifyResponse.status());
    });
  });
});
