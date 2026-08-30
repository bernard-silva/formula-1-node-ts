import type { Driver, Team } from "../models";

/**
 * Camada de dados.
 *
 * Duas novidades neste commit, ambas por causa da escrita:
 *
 * 1. generateDriverId() -- o id passa a ser gerado aqui, sequencialmente.
 * 2. resetDatabase() -- devolve tudo ao estado inicial.
 *
 * O reset existe para os testes. A partir do momento em que a API cria e apaga
 * pilotos, um teste que faz POST deixa o dado la para o proximo teste encontrar,
 * e a suite passa a depender da ordem de execucao. Isso e a receita de teste
 * intermitente. Com resetDatabase() rodando antes de cada teste, todo cenario
 * comeca do mesmo ponto conhecido.
 *
 * Repare que os arrays sao const e o reset limpa com length = 0 + push, em vez
 * de reatribuir. E de proposito: quem importou o array continua com a mesma
 * referencia, entao nao existe risco de um modulo ficar olhando para a lista
 * antiga depois de um reset.
 */

export const teams: Team[] = [];
export const drivers: Driver[] = [];

let nextDriverId = 1;

function seedTeams(): Team[] {
  return [
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
}

function seedDrivers(): Driver[] {
  return [
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
}

export function resetDatabase(): void {
  teams.length = 0;
  teams.push(...seedTeams());

  drivers.length = 0;
  drivers.push(...seedDrivers());

  nextDriverId = drivers.length + 1;
}

export function generateDriverId(): number {
  return nextDriverId++;
}

// Estado inicial ao carregar o modulo.
resetDatabase();
