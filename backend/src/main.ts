import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { testSupabaseConnection } from "./db";
import { validateRequiredEnvVars } from "./config/validate-env";

// Manejo de errores globales (NO tumbar el server en prod por cosas recuperables)
process.on("uncaughtException", (error) => {
  console.error("ERROR NO CAPTURADO:", error);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("PROMESA RECHAZADA NO MANEJADA:", promise, "razon:", reason);
});

async function bootstrap(): Promise<void> {
  // 0) VALIDAR VARIABLES DE ENTORNO CRÍTICAS ANTES DE INICIAR
  try {
    validateRequiredEnvVars();
  } catch (error) {
    console.error("\n❌ Error de validación de variables de entorno:");
    console.error(error instanceof Error ? error.message : String(error));
    console.error("\nPor favor, revisa tu archivo .env y asegúrate de que todas las variables requeridas estén configuradas.\n");
    process.exit(1);
  }

  // 1) PROBAR SUPABASE PERO NO BLOQUEAR EL ARRANQUE (salvo modo estricto)
  const strict =
    String(process.env.SUPABASE_STRICT || "false").toLowerCase() === "true";
  console.log("🔍 Testing Supabase connection...");
  const supabaseConnected = await testSupabaseConnection();
  if (!supabaseConnected) {
    const msg = "❌ Failed to connect to Supabase. Check your configuration.";
    if (strict) {
      console.error(msg);
      process.exit(1);
    } else {
      console.warn(`${msg} (Continuing without Supabase for MVP)`);
    }
  }

  const app = await NestFactory.create(AppModule);

  // 2) Prefijo /api
  app.setGlobalPrefix("api");

  // 3) Seguridad
  app.use(helmet());

  // 4) CORS desde env o por defecto a 5173 y 5174
  const origins = process.env.ALLOWED_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) || ["http://localhost:5173", "http://localhost:5174"];
  app.enableCors({
    origin: origins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: false,
  });

  // 5) Validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // 6) Swagger/OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle("NeuroPlan API")
    .setDescription(
      "API para generación automática de PEIs con IA - MVP Ayuntamiento de Barcelona"
    )
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth", "Autenticación y gestión de usuarios")
    .addTag("students", "Gestión de estudiantes")
    .addTag("peis", "Generación y gestión de PEIs")
    .addTag("uploads", "Carga y análisis de documentos")
    .addTag("aws", "Servicios AWS (Bedrock, Textract, Comprehend)")
    .addTag("dashboard", "Dashboard y estadísticas")
    .addTag("notifications", "Notificaciones")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "NeuroPlan API Docs",
    customCss: ".swagger-ui .topbar { display: none }",
  });

  // 7) Puerto desde env (fallback 3001)
  const port = Number(process.env.PORT || 3001);
  await app.listen(port);

  console.log("\n==============================================");
  console.log("   NeuroPlan AI Campus - Backend MVP");
  console.log("==============================================");
  console.log(`API:    http://localhost:${port}/api`);
  console.log(`Docs:   http://localhost:${port}/api/docs`);
  console.log(`Health: http://localhost:${port}/api/health`);
  console.log(`Modo:   ${process.env.NODE_ENV || "development"}`);
  console.log(`CORS:   ${origins.join(", ")}`);
}

// Bootstrap con IIFE: NestJS usa CommonJS que no soporta top-level await
// eslint-disable-next-line sonarjs/no-async-iife
// eslint-disable-next-line @typescript-eslint/no-floating-promises
void (async () => {
  try {
    await bootstrap();
  } catch (error) {
    console.error("Error al iniciar la aplicacion:", error);
    process.exit(1);
  }
})();
