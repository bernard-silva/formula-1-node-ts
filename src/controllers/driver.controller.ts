import type { FastifyReply, FastifyRequest } from "fastify";
import type { DriverFilters } from "../models";
import { findAllDrivers, getDriverById, getDriverTeam } from "../services/driver.service";

export async function listDrivers(
  request: FastifyRequest<{ Querystring: DriverFilters }>,
  reply: FastifyReply,
) {
  return reply.code(200).send(findAllDrivers(request.query));
}

export async function getDriver(
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) {
  return reply.code(200).send(getDriverById(request.params.id));
}

export async function getDriverTeamById(
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) {
  return reply.code(200).send(getDriverTeam(request.params.id));
}
