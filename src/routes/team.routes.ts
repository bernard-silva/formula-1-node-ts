import type { FastifyInstance } from "fastify";
import { getTeamById, listTeams } from "../controllers/team.controller";

/**
 * Camada de rotas: so declara o mapa URL -> handler.
 * Olhando este arquivo se sabe toda a superficie da API de times.
 */
export async function teamRoutes(app: FastifyInstance) {
  app.get("/teams", listTeams);
  app.get<{ Params: { id: string } }>("/teams/:id", getTeamById);
}
