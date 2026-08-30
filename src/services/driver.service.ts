import { drivers, generateDriverId } from "../data/database";
import { conflict, invalidReference, notFound } from "../errors/app-error";
import type { Driver, DriverFilters, DriverInput, Team } from "../models";
import { getTeamById, teamExists } from "./team.service";

export function findAllDrivers(filters: DriverFilters = {}): Driver[] {
  let result = drivers;

  if (filters.teamId !== undefined) {
    result = result.filter((driver) => driver.teamId === filters.teamId);
  }

  if (filters.name) {
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

export function getDriverTeam(driverId: number): Team {
  const driver = getDriverById(driverId);
  return getTeamById(driver.teamId);
}

export function createDriver(input: DriverInput): Driver {
  assertTeamExists(input.teamId);
  assertNumberIsAvailable(input.number);

  const driver: Driver = { id: generateDriverId(), ...input };
  drivers.push(driver);

  return driver;
}

export function updateDriver(id: number, input: DriverInput): Driver {
  const current = getDriverById(id);

  assertTeamExists(input.teamId);
  // ignoreId permite ao piloto manter o proprio numero. Sem isso, atualizar o
  // nome de um piloto falharia com 409 por "conflito" com ele mesmo -- um bug
  // classico de regra de unicidade.
  assertNumberIsAvailable(input.number, id);

  const updated: Driver = { id: current.id, ...input };
  drivers[drivers.indexOf(current)] = updated;

  return updated;
}

export function deleteDriver(id: number): void {
  const current = getDriverById(id);
  drivers.splice(drivers.indexOf(current), 1);
}

function assertTeamExists(teamId: number): void {
  if (!teamExists(teamId)) {
    throw invalidReference(`Team with id ${teamId} does not exist`);
  }
}

/** Numero de carro e unico no grid. */
function assertNumberIsAvailable(number: number, ignoreId?: number): void {
  const owner = drivers.find((driver) => driver.number === number);

  if (owner && owner.id !== ignoreId) {
    throw conflict(`Car number ${number} is already taken by driver ${owner.id}`);
  }
}
