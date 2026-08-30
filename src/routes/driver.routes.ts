import type { FastifyInstance } from "fastify";
import {
  getDriver,
  getDriverTeamById,
  listDrivers,
  postDriver,
  putDriver,
  removeDriver,
} from "../controllers/driver.controller";
import type { DriverFilters, DriverInput } from "../models";
import { idParamSchema } from "../schemas/common.schema";
import { driverBodySchema, listDriversQuerySchema } from "../schemas/driver.schema";

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

  app.post<{ Body: DriverInput }>(
    "/drivers",
    { schema: { body: driverBodySchema } },
    postDriver,
  );

  app.put<{ Params: { id: number }; Body: DriverInput }>(
    "/drivers/:id",
    { schema: { params: idParamSchema, body: driverBodySchema } },
    putDriver,
  );

  app.delete<{ Params: { id: number } }>(
    "/drivers/:id",
    { schema: { params: idParamSchema } },
    removeDriver,
  );
}
