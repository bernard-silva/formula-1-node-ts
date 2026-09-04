import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerErrorHandling } from "./plugins/error-handler";
import { registerSwagger } from "./plugins/swagger";
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
        // O default do Fastify e removeAdditional: true, que DESCARTA em silencio
        // campos fora do schema em vez de recusar a requisicao.
        removeAdditional: false,
        // Reporta todas as violacoes de uma vez, nao so a primeira.
        allErrors: true,
      },
    },
  });

  await app.register(cors, { origin: "*" });

  registerErrorHandling(app);

  // Antes das rotas: o plugin coleta os schemas no momento do registro de cada uma.
  await registerSwagger(app);

  await registerRoutes(app);

  return app;
}
