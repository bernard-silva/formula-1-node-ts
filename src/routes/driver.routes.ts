import type { FastifyInstance } from "fastify";
import { getDriver, listDrivers } from "../controllers/driver.controller";
import { idParamSchema } from "../schemas/common.schema";

export async function driverRoutes(app: FastifyInstance) {
  app.get("/drivers", listDrivers);

  app.get<{ Params: { id: number } }>(
    "/drivers/:id",
    { schema: { params: idParamSchema } },
    getDriver,
  );
}
