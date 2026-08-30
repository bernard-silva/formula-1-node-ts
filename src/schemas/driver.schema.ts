export const listDriversQuerySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    teamId: { type: "integer", minimum: 1, description: "Filtra pilotos de um time" },
    name: { type: "string", minLength: 2, description: "Busca parcial pelo nome" },
  },
} as const;

/**
 * Contrato do corpo de POST e PUT.
 *
 * additionalProperties: false recusa campo nao previsto. Sem isso, um cliente
 * que manda "nubmer" com typo recebe 201, acha que salvou, e o dado nao esta la.
 * Falhar alto e melhor que falhar em silencio.
 */
export const driverBodySchema = {
  type: "object",
  required: ["name", "teamId", "number"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 2, maxLength: 60 },
    teamId: { type: "integer", minimum: 1 },
    number: { type: "integer", minimum: 1, maximum: 99 },
  },
} as const;
