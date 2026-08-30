export interface Team {
  id: number;
  name: string;
  base: string;
}

export interface Driver {
  id: number;
  name: string;
  teamId: number;
  number: number;
}

/**
 * Payload de escrita: tudo que um piloto tem, MENOS o id.
 *
 * Omit<Driver, "id"> nao e detalhe de estilo -- e o que impede o cliente de
 * escolher o proprio id. Foi exatamente assim que nasceu o bug de id duplicado
 * do projeto original: o id vinha escrito no dado. Agora quem gera e a camada
 * de dados, e duplicidade fica impossivel por construcao.
 */
export type DriverInput = Omit<Driver, "id">;

export interface DriverFilters {
  teamId?: number;
  name?: string;
}
