export interface Team {
  id: number;
  name: string;
  base: string;
}

/**
 * O piloto agora aponta para o time por teamId, e nao mais pelo nome em texto.
 *
 * No original o campo era team: "Ferrari". Isso quebra de duas formas: um typo
 * no nome desliga o vinculo em silencio, e renomear um time exige atualizar
 * todos os pilotos. Referenciar por id e o que qualquer banco relacional faria.
 */
export interface Driver {
  id: number;
  name: string;
  teamId: number;
  number: number;
}

/** Filtros aceitos em GET /drivers. */
export interface DriverFilters {
  teamId?: number;
  name?: string;
}
