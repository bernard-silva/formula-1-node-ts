import fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerRoutes } from "./routes";

/**
 * Application factory.
 *
 * A mudanca mais importante deste commit: construir a aplicacao e coloca-la em
 * escuta passaram a ser coisas separadas.
 *
 * No original, o fastify() e o listen() estavam no mesmo arquivo. Isso impede
 * teste automatizado: nao havia como obter a aplicacao pronta sem abrir uma
 * porta TCP. Com buildApp(), o teste chama esta funcao e usa app.inject() para
 * fazer requisicoes em memoria -- sem porta, sem espera de subida, sem conflito
 * ao rodar em paralelo. E o que viabiliza o commit 5.
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({ logger: true });

  await app.register(cors, { origin: "*" });
  await registerRoutes(app);

  return app;
}
