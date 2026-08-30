/**
 * Schemas compartilhados entre rotas.
 *
 * JSON Schema e o mecanismo nativo de validacao do Fastify. Declarar o contrato
 * substitui codigo de validacao escrito a mao: o framework recusa a requisicao
 * antes de o handler rodar. No commit 6 o mesmo objeto vai alimentar o Swagger,
 * sem duplicar nada.
 */

export const idParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "integer",
      minimum: 1,
      description: "Identificador numerico do recurso",
    },
  },
} as const;
