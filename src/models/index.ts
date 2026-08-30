/**
 * Tipos de dominio.
 *
 * Ficam separados porque descrevem O QUE a aplicacao manipula, independente de
 * como os dados chegam (HTTP) ou de onde estao guardados (array, banco).
 */

export interface Team {
  id: number;
  name: string;
  base: string;
}

export interface Driver {
  id: number;
  name: string;
  team: string;
}
