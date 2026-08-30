import type { FastifyReply, FastifyRequest } from "fastify";
import { findAllTeams, getTeamById } from "../services/team.service";

/**
 * Controllers ficaram menores: nada de Number(), nada de if de 404.
 *
 * O id ja chega convertido em numero -- o JSON Schema da rota declara
 * type: integer e o Fastify converte e valida antes do handler. E o "nao achou"
 * virou responsabilidade do service, que lanca AppError.
 */

export async function listTeams(_request: FastifyRequest, reply: FastifyReply) {
  return reply.code(200).send(findAllTeams());
}

export async function getTeam(
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) {
  return reply.code(200).send(getTeamById(request.params.id));
}
