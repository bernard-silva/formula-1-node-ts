import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerErrorHandling } from "./plugins/error-handler";
import { registerRoutes } from "./routes";

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: true,
    ajv: {
      customOptions: {
        // O default do Fastify e removeAdditional: true, que DESCARTA em silencio
        // campos fora do schema em vez de recusar a requisicao. Combinado com
        // additionalProperties: false isso significa que o typo do cliente e
        // apagado e ele recebe 201 achando que salvou. Com false, vira 400.
        removeAdditional: false,
        // Reporta todas as violacoes de uma vez, nao so a primeira. Quem esta
        // integrando descobre os tres campos errados numa tentativa.
        allErrors: true,
      },
    },
  });

  await app.register(cors, { origin: "*" });

  registerErrorHandling(app);

  await registerRoutes(app);

  return app;
}
