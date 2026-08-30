import type { FastifyReply, FastifyRequest } from "fastify";
import type { DriverFilters, DriverInput } from "../models";
import {
  createDriver,
  deleteDriver,
  findAllDrivers,
  getDriverById,
  getDriverTeam,
  updateDriver,
} from "../services/driver.service";

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

export async function postDriver(
  request: FastifyRequest<{ Body: DriverInput }>,
  reply: FastifyReply,
) {
  const driver = createDriver(request.body);

  // 201 acompanhado do header Location apontando para o recurso criado.
  return reply.code(201).header("location", `/drivers/${driver.id}`).send(driver);
}

export async function putDriver(
  request: FastifyRequest<{ Params: { id: number }; Body: DriverInput }>,
  reply: FastifyReply,
) {
  return reply.code(200).send(updateDriver(request.params.id, request.body));
}

export async function removeDriver(
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) {
  deleteDriver(request.params.id);

  // 204 No Content: deu certo e nao ha nada para devolver.
  return reply.code(204).send();
}
