import { drivers } from "../data/database";
import type { Driver } from "../models";

export function findAllDrivers(): Driver[] {
  return drivers;
}

export function findDriverById(id: number): Driver | undefined {
  return drivers.find((driver) => driver.id === id);
}
