import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerErrorHandling } from "./plugins/error-handler";
import { registerRoutes } from "./routes";

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({ logger: true });

  await app.register(cors, { origin: "*" });

  // Chamada direta, sem register: ver comentario em plugins/error-handler.ts.
  registerErrorHandling(app);

  await registerRoutes(app);

  return app;
}
