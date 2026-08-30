import { drivers } from "../data/database";
import { notFound } from "../errors/app-error";
import type { Driver } from "../models";

export function findAllDrivers(): Driver[] {
  return drivers;
}

export function getDriverById(id: number): Driver {
  const driver = drivers.find((item) => item.id === id);

  if (!driver) {
    throw notFound("Driver", id);
  }

  return driver;
}
