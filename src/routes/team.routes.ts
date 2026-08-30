import type { FastifyInstance } from "fastify";
import { getTeam, listTeams } from "../controllers/team.controller";
import { idParamSchema } from "../schemas/common.schema";

export async function teamRoutes(app: FastifyInstance) {
  app.get("/teams", listTeams);

  app.get<{ Params: { id: number } }>(
    "/teams/:id",
    { schema: { params: idParamSchema } },
    getTeam,
  );
}
