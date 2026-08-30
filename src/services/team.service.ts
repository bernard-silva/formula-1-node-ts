import { teams } from "../data/database";
import type { Team } from "../models";

/**
 * Camada de servico: regras de negocio e acesso aos dados.
 *
 * Nao conhece nada de HTTP -- nao recebe request, nao devolve response, nao sabe
 * o que e status code. Recebe e devolve tipos de dominio. E o que permite testar
 * regra de negocio sem subir servidor.
 */

export function findAllTeams(): Team[] {
  return teams;
}

export function findTeamById(id: number): Team | undefined {
  return teams.find((team) => team.id === id);
}
