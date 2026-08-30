import type { FastifyInstance } from "fastify";
import { getDriver, getDriverTeamById, listDrivers } from "../controllers/driver.controller";
import { idParamSchema } from "../schemas/common.schema";
import { listDriversQuerySchema } from "../schemas/driver.schema";
import type { DriverFilters } from "../models";

export async function driverRoutes(app: FastifyInstance) {
  app.get<{ Querystring: DriverFilters }>(
    "/drivers",
    { schema: { querystring: listDriversQuerySchema } },
    listDrivers,
  );

  app.get<{ Params: { id: number } }>(
    "/drivers/:id",
    { schema: { params: idParamSchema } },
    getDriver,
  );

  app.get<{ Params: { id: number } }>(
    "/drivers/:id/team",
    { schema: { params: idParamSchema } },
    getDriverTeamById,
  );
}
