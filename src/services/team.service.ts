import { teams } from "../data/database";
import { notFound } from "../errors/app-error";
import type { Team } from "../models";

export function findAllTeams(): Team[] {
  return teams;
}

/**
 * Lanca em vez de devolver undefined.
 *
 * O controller nao precisa mais decidir o que fazer quando nao acha -- some o if
 * repetido em cada handler, e fica impossivel esquecer de tratar o caso.
 */
export function getTeamById(id: number): Team {
  const team = teams.find((item) => item.id === id);

  if (!team) {
    throw notFound("Team", id);
  }

  return team;
}
