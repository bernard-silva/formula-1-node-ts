import type { FastifyReply, FastifyRequest } from "fastify";
import { findAllDrivers, getDriverById } from "../services/driver.service";

export async function listDrivers(_request: FastifyRequest, reply: FastifyReply) {
  return reply.code(200).send(findAllDrivers());
}

export async function getDriver(
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) {
  return reply.code(200).send(getDriverById(request.params.id));
}
