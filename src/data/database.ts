import type { Driver, Team } from "../models";

/**
 * Camada de dados.
 *
 * Ainda sao arrays em memoria, exatamente como no projeto original -- a mudanca
 * aqui e so de lugar: saiu do server.ts e virou um modulo com responsabilidade
 * unica. Se um dia virar banco de verdade, e este arquivo que muda.
 *
 * ATENCAO: os dados abaixo foram copiados do original SEM correcao, de proposito.
 * Ha um id duplicado entre os pilotos e o vinculo com o time e feito por texto
 * livre. Sao dois defeitos reais, corrigidos no commit 3 com teste provando.
 */

export const teams: Team[] = [
  { id: 1, name: "McLaren", base: "Woking, United Kingdom" },
  { id: 2, name: "Mercedes", base: "Brackley, United Kingdom" },
  { id: 3, name: "Red Bull Racing", base: "Milton Keynes, United Kingdom" },
  { id: 4, name: "Ferrari", base: "Maranello, Italy" },
  { id: 5, name: "Alpine", base: "Enstone, United Kingdom" },
  { id: 6, name: "Aston Martin", base: "Silverstone, United Kingdom" },
  { id: 7, name: "Williams", base: "Grove, United Kingdom" },
  { id: 8, name: "Haas", base: "Kannapolis, United States" },
  { id: 9, name: "Racing Bulls", base: "Faenza, Italy" },
  { id: 10, name: "Kick Sauber", base: "Hinwil, Switzerland" },
];

export const drivers: Driver[] = [
  { id: 1, name: "Max Verstappen", team: "Red Bull Racing" },
  { id: 2, name: "Lewis Hamilton", team: "Ferrari" },
  { id: 2, name: "Lando Norris", team: "McLaren" },
];
