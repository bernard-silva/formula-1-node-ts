import type { FastifyInstance } from "fastify";
import { getDriverById, listDrivers } from "../controllers/driver.controller";

export async function driverRoutes(app: FastifyInstance) {
  app.get("/drivers", listDrivers);
  app.get<{ Params: { id: string } }>("/drivers/:id", getDriverById);
}
