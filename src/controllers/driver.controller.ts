import type { FastifyReply, FastifyRequest } from "fastify";
import { findAllDrivers, findDriverById } from "../services/driver.service";

export async function listDrivers(_request: FastifyRequest, reply: FastifyReply) {
  const drivers = findAllDrivers();
  return reply.code(200).send(drivers);
}

export async function getDriverById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const id = Number(request.params.id);
  const driver = findDriverById(id);

  if (!driver) {
    return reply.code(404).send({ message: "Driver not found" });
  }

  return reply.code(200).send(driver);
}
