import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

/**
 * Documentacao OpenAPI.
 *
 * Nao ha nenhuma descricao de endpoint escrita aqui: o plugin le os JSON Schema
 * que as rotas ja declaram para validacao e monta a especificacao a partir
 * deles. Mesma fonte de verdade para validar e para documentar, entao a
 * documentacao nao tem como ficar defasada do codigo.
 *
 * Precisa ser registrado ANTES das rotas -- o plugin escuta o evento de
 * registro de cada uma para coleta-las.
 */
export async function registerSwagger(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "F1 API",
        description:
          "API REST de times e pilotos de Formula 1. Evolucao do desafio " +
          "node-formula-1 da DIO, com arquitetura em camadas, CRUD, validacao " +
          "por contrato e testes automatizados.",
        version: "1.0.0",
      },
      tags: [
        { name: "Teams", description: "Consulta de times" },
        { name: "Drivers", description: "CRUD de pilotos" },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list" },
  });
}
