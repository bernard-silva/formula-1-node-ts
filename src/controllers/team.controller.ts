import type { FastifyReply, FastifyRequest } from "fastify";
import { findAllTeams, findTeamById } from "../services/team.service";

/**
 * Camada de controller: a ponte entre HTTP e dominio.
 *
 * Responsabilidade unica -- ler a requisicao, chamar o service, montar a
 * resposta com o status code certo. Nenhuma regra de negocio aqui.
 */

export async function listTeams(_request: FastifyRequest, reply: FastifyReply) {
  const teams = findAllTeams();
  return reply.code(200).send(teams);
}

export async function getTeamById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  // Number() ainda sem validacao, igual ao original. Isso vira 400 de verdade
  // no commit 2, quando entrar o JSON Schema.
  const id = Number(request.params.id);
  const team = findTeamById(id);

  if (!team) {
    return reply.code(404).send({ message: "Team not found" });
  }

  return reply.code(200).send(team);
}
