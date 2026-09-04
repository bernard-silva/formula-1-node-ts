import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerErrorHandling } from "./plugins/error-handler";
import { registerRoutes } from "./routes";

export interface BuildAppOptions {
  /** Desligado nos testes para a saida do Vitest ficar legivel. */
  logger?: boolean;
}

export async function buildApp({ logger = true }: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = fastify({
    logger,
    ajv: {
      customOptions: {
        removeAdditional: false,
        allErrors: true,
      },
    },
  });

  await app.register(cors, { origin: "*" });

  registerErrorHandling(app);

  await registerRoutes(app);

  return app;
}
