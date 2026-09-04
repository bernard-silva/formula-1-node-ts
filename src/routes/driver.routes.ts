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
    {
      schema: {
        tags: ["Drivers"],
        summary: "Lista pilotos, com filtro opcional por time ou nome",
        querystring: listDriversQuerySchema,
      },
    },
    listDrivers,
  );

  app.get<{ Params: { id: number } }>(
    "/drivers/:id",
    {
      schema: {
        tags: ["Drivers"],
        summary: "Busca um piloto por id",
        params: idParamSchema,
      },
    },
    getDriver,
  );

  app.get<{ Params: { id: number } }>(
    "/drivers/:id/team",
    {
      schema: {
        tags: ["Drivers"],
        summary: "Retorna o time de um piloto",
        params: idParamSchema,
      },
    },
    getDriverTeamById,
  );

  app.post<{ Body: DriverInput }>(
    "/drivers",
    {
      schema: {
        tags: ["Drivers"],
        summary: "Cria um piloto",
        body: driverBodySchema,
      },
    },
    postDriver,
  );

  app.put<{ Params: { id: number }; Body: DriverInput }>(
    "/drivers/:id",
    {
      schema: {
        tags: ["Drivers"],
        summary: "Atualiza um piloto por completo",
        params: idParamSchema,
        body: driverBodySchema,
      },
    },
    putDriver,
  );

  app.delete<{ Params: { id: number } }>(
    "/drivers/:id",
    {
      schema: {
        tags: ["Drivers"],
        summary: "Remove um piloto",
        params: idParamSchema,
      },
    },
    removeDriver,
  );
}
