/** Contrato dos filtros de GET /drivers. */
export const listDriversQuerySchema = {
  type: "object",
  properties: {
    teamId: {
      type: "integer",
      minimum: 1,
      description: "Filtra pilotos de um time",
    },
    name: {
      type: "string",
      minLength: 2,
      description: "Busca parcial pelo nome do piloto",
    },
  },
} as const;
