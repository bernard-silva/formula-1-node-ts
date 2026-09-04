import type { FastifyInstance } from "fastify";
import { getTeam, listTeams } from "../controllers/team.controller";
import { idParamSchema } from "../schemas/common.schema";

export async function teamRoutes(app: FastifyInstance) {
  app.get(
    "/teams",
    {
      // tags e summary alimentam a documentacao em /docs.
      schema: { tags: ["Teams"], summary: "Lista todos os times" },
    },
    listTeams,
  );

  app.get<{ Params: { id: number } }>(
    "/teams/:id",
    {
      schema: {
        tags: ["Teams"],
        summary: "Busca um time por id",
        params: idParamSchema,
      },
    },
    getTeam,
  );
}
