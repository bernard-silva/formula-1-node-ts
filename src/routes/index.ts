import type { FastifyInstance } from "fastify";
import { driverRoutes } from "./driver.routes";
import { teamRoutes } from "./team.routes";

/** Ponto unico de registro. Recurso novo = criar o arquivo de rotas e registrar aqui. */
export async function registerRoutes(app: FastifyInstance) {
  await app.register(teamRoutes);
  await app.register(driverRoutes);
}
