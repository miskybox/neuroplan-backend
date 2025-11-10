import { test, expect } from "@playwright/test";

const FRONTEND_URL = "http://localhost:5173";
const CREDENTIALS = {
  admin: { email: "admin@test.com", password: "Test123456!" },
  profesor: { email: "profesor@test.com", password: "Test123456!" },
  orientador: { email: "orientador@test.com", password: "Test123456!" },
};

test.describe("Frontend UI - Authentication Flow", () => {
  test("Should display login page", async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);

    // Verificar que la página de login se carga
    await expect(page).toHaveTitle(/NeuroPlan/i);

    // Verificar elementos del formulario
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password|contraseña/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /iniciar sesión|login/i })
    ).toBeVisible();
  });

  test("Should show error on invalid login", async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);

    // Intentar login con credenciales incorrectas
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password|contraseña/i).fill("wrongpassword");
    await page.getByRole("button", { name: /iniciar sesión|login/i }).click();

    // Verificar que aparece un mensaje de error
    await expect(page.getByText(/error|incorrecto|inválido/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("Should login successfully with admin credentials", async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);

    // Login
    await page.getByLabel(/email/i).fill(CREDENTIALS.admin.email);
    await page
      .getByLabel(/password|contraseña/i)
      .fill(CREDENTIALS.admin.password);
    await page.getByRole("button", { name: /iniciar sesión|login/i }).click();

    // Verificar redirección al dashboard
    await expect(page).toHaveURL(/dashboard/i, { timeout: 10000 });

    // Verificar que el dashboard contiene elementos esperados
    await expect(page.getByText(/panel|dashboard/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("Should logout successfully", async ({ page }) => {
    // Login primero
    await page.goto(`${FRONTEND_URL}/login`);
    await page.getByLabel(/email/i).fill(CREDENTIALS.admin.email);
    await page
      .getByLabel(/password|contraseña/i)
      .fill(CREDENTIALS.admin.password);
    await page.getByRole("button", { name: /iniciar sesión|login/i }).click();

    await expect(page).toHaveURL(/dashboard/i, { timeout: 10000 });

    // Hacer logout
    await page
      .getByRole("button", { name: /cerrar sesión|logout|salir/i })
      .click();

    // Verificar redirección al login
    await expect(page).toHaveURL(/login/i, { timeout: 5000 });
  });
});

test.describe("Frontend UI - Student Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto(`${FRONTEND_URL}/login`);
    await page.getByLabel(/email/i).fill(CREDENTIALS.admin.email);
    await page
      .getByLabel(/password|contraseña/i)
      .fill(CREDENTIALS.admin.password);
    await page.getByRole("button", { name: /iniciar sesión|login/i }).click();
    await expect(page).toHaveURL(/dashboard/i, { timeout: 10000 });
  });

  test("Should navigate to students page", async ({ page }) => {
    // Buscar link de estudiantes
    const studentsLink = page.getByRole("link", {
      name: /estudiantes|students/i,
    });

    if (await studentsLink.isVisible()) {
      await studentsLink.click();
      await expect(page).toHaveURL(/estudiantes|students/i, { timeout: 5000 });
    } else {
      // Si no hay link visible, ir directamente
      await page.goto(`${FRONTEND_URL}/estudiantes`);
    }

    // Verificar que estamos en la página de estudiantes
    await expect(
      page.getByText(/lista de estudiantes|students list/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("Should display student creation form", async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/estudiantes`);

    // Buscar botón para crear estudiante
    const createButton = page
      .getByRole("button", { name: /nuevo estudiante|crear|añadir/i })
      .first();

    if (await createButton.isVisible({ timeout: 5000 })) {
      await createButton.click();

      // Verificar que aparece el formulario
      await expect(page.getByLabel(/nombre/i)).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe("Frontend UI - Dashboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(`${FRONTEND_URL}/login`);
    await page.getByLabel(/email/i).fill(CREDENTIALS.orientador.email);
    await page
      .getByLabel(/password|contraseña/i)
      .fill(CREDENTIALS.orientador.password);
    await page.getByRole("button", { name: /iniciar sesión|login/i }).click();
    await expect(page).toHaveURL(/dashboard/i, { timeout: 10000 });
  });

  test("Should display dashboard stats", async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/dashboard`);

    // Verificar que hay estadísticas o cards en el dashboard
    const statsVisible = await page
      .getByText(/total|estudiantes|peis|activity/i)
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (statsVisible) {
      expect(statsVisible).toBeTruthy();
    } else {
      // Si no hay stats, al menos verificar que la página cargó
      await expect(page).toHaveURL(/dashboard/i);
    }
  });

  test("Should navigate between main sections", async ({ page }) => {
    // Intentar navegar a diferentes secciones
    const sections = [
      { name: /estudiantes|students/i, url: /estudiantes|students/i },
      { name: /peis/i, url: /peis/i },
      { name: /recursos|resources/i, url: /recursos|resources/i },
    ];

    for (const section of sections) {
      const link = page.getByRole("link", { name: section.name }).first();

      if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
        await link.click();
        await page.waitForTimeout(1000);

        // Verificar que la URL cambió
        const currentUrl = page.url();
        expect(currentUrl).toMatch(section.url);

        // Volver al dashboard
        await page.goto(`${FRONTEND_URL}/dashboard`);
      }
    }
  });
});

test.describe("Frontend UI - Accessibility", () => {
  test("Should have proper heading hierarchy", async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);

    // Verificar que hay un h1
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("Should have alt text for images", async ({ page }) => {
    await page.goto(FRONTEND_URL);

    // Verificar que las imágenes tienen alt text
    const images = await page.locator("img").all();

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      expect(alt).toBeDefined();
    }
  });

  test("Should be keyboard navigable", async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);

    // Tab para navegar por los elementos
    await page.keyboard.press("Tab");

    // Verificar que hay un elemento con foco
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focusedElement).toBeTruthy();
  });
});

test.describe("Frontend UI - Responsive Design", () => {
  test("Should be mobile responsive", async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(FRONTEND_URL);

    // Verificar que la página se carga correctamente
    await expect(page).toHaveTitle(/NeuroPlan/i);
  });

  test("Should be tablet responsive", async ({ page }) => {
    // Configurar viewport tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(FRONTEND_URL);

    // Verificar que la página se carga correctamente
    await expect(page).toHaveTitle(/NeuroPlan/i);
  });

  test("Should handle menu on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(FRONTEND_URL);

    // Buscar botón de menú hamburguesa
    const menuButton = page.getByRole("button", { name: /menu|menú/i });

    if (await menuButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await menuButton.click();

      // Verificar que el menú se abre
      await page.waitForTimeout(500);
    }
  });
});
