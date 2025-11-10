import { test, expect } from "@playwright/test";
import { getAuthToken } from "./helpers/auth";

const API_BASE_URL = "http://localhost:3001/api";

// Usuario de pruebas consistente con el resto de suites
const ADMIN_USER = {
  email: "e2e-test@neuroplan.com",
  password: "E2eTest2024!",
};

test.describe("Videos API E2E Tests", () => {
  let accessToken: string;

  test.beforeAll(async ({ request }) => {
    accessToken = await getAuthToken(
      request,
      ADMIN_USER.email,
      ADMIN_USER.password
    );
  });

  test.describe("GET /videos - List", () => {
    test("should reject without authentication", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/videos`);
      expect(response.status()).toBe(401);
    });

    test("should list videos with authentication", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/videos`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.message).toContain("videos");

      if (body.data.length > 0) {
        const video = body.data[0];
        expect(video).toHaveProperty("id");
        expect(video).toHaveProperty("title");
        expect(video).toHaveProperty("subject");
        expect(video).toHaveProperty("level");
        expect(video).toHaveProperty("tags");
      }
    });

    test("should filter by subject and level", async ({ request }) => {
      const response = await request.get(
        `${API_BASE_URL}/videos?subject=Matemáticas&level=ESO`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body.data)).toBe(true);

      if (body.data.length > 0) {
        for (const v of body.data) {
          expect(v.subject.toLowerCase()).toContain("matemáticas".toLowerCase());
          expect(v.level.toLowerCase()).toContain("eso".toLowerCase());
        }
      }
    });
  });

  test.describe("GET /videos/:id - Detail", () => {
    test("should reject without authentication", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/videos/1`);
      expect(response.status()).toBe(401);
    });

    test("should get video by id with authentication", async ({ request }) => {
      // En modo mock, existe el id "1"
      const response = await request.get(`${API_BASE_URL}/videos/1`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe("1");
      expect(body.data.title).toBeDefined();
    });
  });
});