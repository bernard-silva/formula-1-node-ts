import type { Driver, Team } from "../models";

/**
 * Camada de dados.
 *
 * Correcao aplicada neste commit: no original havia dois pilotos com id 2
 * (Lewis Hamilton e Lando Norris). Como a busca usa find(), que devolve a
 * primeira ocorrencia, GET /drivers/2 retornava sempre Hamilton -- o registro do
 * Norris existia na colecao e era inalcancavel pela API.
 *
 * Agora os ids sao sequenciais e unicos, e o grid esta completo.
 * Dados ilustrativos, baseados na temporada de 2025.
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
  { id: 1, name: "Lando Norris", teamId: 1, number: 4 },
  { id: 2, name: "Oscar Piastri", teamId: 1, number: 81 },
  { id: 3, name: "George Russell", teamId: 2, number: 63 },
  { id: 4, name: "Kimi Antonelli", teamId: 2, number: 12 },
  { id: 5, name: "Max Verstappen", teamId: 3, number: 1 },
  { id: 6, name: "Yuki Tsunoda", teamId: 3, number: 22 },
  { id: 7, name: "Charles Leclerc", teamId: 4, number: 16 },
  { id: 8, name: "Lewis Hamilton", teamId: 4, number: 44 },
  { id: 9, name: "Pierre Gasly", teamId: 5, number: 10 },
  { id: 10, name: "Franco Colapinto", teamId: 5, number: 43 },
  { id: 11, name: "Fernando Alonso", teamId: 6, number: 14 },
  { id: 12, name: "Lance Stroll", teamId: 6, number: 18 },
  { id: 13, name: "Alexander Albon", teamId: 7, number: 23 },
  { id: 14, name: "Carlos Sainz", teamId: 7, number: 55 },
  { id: 15, name: "Esteban Ocon", teamId: 8, number: 31 },
  { id: 16, name: "Oliver Bearman", teamId: 8, number: 87 },
  { id: 17, name: "Isack Hadjar", teamId: 9, number: 6 },
  { id: 18, name: "Liam Lawson", teamId: 9, number: 30 },
  { id: 19, name: "Nico Hulkenberg", teamId: 10, number: 27 },
  { id: 20, name: "Gabriel Bortoleto", teamId: 10, number: 5 },
];
