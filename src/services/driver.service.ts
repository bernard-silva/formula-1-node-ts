import { drivers } from "../data/database";
import { notFound } from "../errors/app-error";
import type { Driver, DriverFilters, Team } from "../models";
import { getTeamById } from "./team.service";

/**
 * Filtros aplicados em sequencia: cada um estreita o resultado do anterior.
 * Nenhum filtro informado devolve a lista inteira.
 */
export function findAllDrivers(filters: DriverFilters = {}): Driver[] {
  let result = drivers;

  if (filters.teamId !== undefined) {
    result = result.filter((driver) => driver.teamId === filters.teamId);
  }

  if (filters.name) {
    // Busca parcial e sem diferenciar maiuscula: "hamil" acha "Lewis Hamilton".
    // Quem usa a API nao deveria ter que acertar o nome exato.
    const term = filters.name.trim().toLowerCase();
    result = result.filter((driver) => driver.name.toLowerCase().includes(term));
  }

  return result;
}

export function getDriverById(id: number): Driver {
  const driver = drivers.find((item) => item.id === id);

  if (!driver) {
    throw notFound("Driver", id);
  }

  return driver;
}

/**
 * "Qual o time deste piloto" e uma pergunta de dominio, entao vive no service e
 * nao no controller. Reaproveita getTeamById, que ja sabe lancar 404 -- se um
 * piloto apontar para um teamId inexistente, o erro aparece em vez de virar null.
 */
export function getDriverTeam(driverId: number): Team {
  const driver = getDriverById(driverId);
  return getTeamById(driver.teamId);
}
