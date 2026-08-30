import { teams } from "../data/database";
import { notFound } from "../errors/app-error";
import type { Team } from "../models";

export function findAllTeams(): Team[] {
  return teams;
}

export function getTeamById(id: number): Team {
  const team = teams.find((item) => item.id === id);

  if (!team) {
    throw notFound("Team", id);
  }

  return team;
}

/** Versao que responde sem lancar, para quem so precisa checar existencia. */
export function teamExists(id: number): boolean {
  return teams.some((team) => team.id === id);
}
