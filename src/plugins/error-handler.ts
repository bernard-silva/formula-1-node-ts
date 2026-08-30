import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../errors/app-error";

/**
 * Tratamento centralizado de erros.
 *
 * Antes, cada handler fazia seu proprio if + reply.code(404). Com dois endpoints
 * isso funciona; com dez, os formatos comecam a divergir entre rotas -- e resposta
 * de erro inconsistente quebra cliente em producao e da trabalho de testar.
 * Agora existe um lugar so, e toda resposta de erro tem a mesma forma.
 *
 * ATENCAO ao modo de uso: esta funcao e chamada DIRETAMENTE com a instancia raiz,
 * e nao via app.register(). setErrorHandler respeita a encapsulacao do Fastify --
 * registrado dentro de um plugin, valeria apenas para as rotas daquele contexto,
 * e as rotas registradas em contextos irmaos cairiam no handler default. Esse tipo
 * de erro nao aparece em desenvolvimento: aparece quando alguem consome a API.
 */
export function registerErrorHandling(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    // 1. Erro previsto, lancado pela nossa propria regra.
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        statusCode: error.statusCode,
        code: error.code,
        message: error.message,
      });
    }

    // 2. Falha de schema: o ajv reprovou params, query ou body.
    if (error.validation) {
      const details = error.validation.map((issue) => {
        const params = issue.params as { missingProperty?: string } | undefined;
        const field = issue.instancePath.replace(/^\//, "") || params?.missingProperty || "(root)";
        return { field, message: issue.message ?? "invalid value" };
      });

      return reply.code(400).send({
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details,
      });
    }

    // 3. JSON malformado no corpo da requisicao.
    if (error.statusCode === 400) {
      return reply.code(400).send({
        statusCode: 400,
        code: "BAD_REQUEST",
        message: error.message,
      });
    }

    // 4. Qualquer outra coisa e bug nosso: loga completo, responde generico.
    // Stack trace e detalhe interno nunca vao para o cliente.
    request.log.error({ err: error }, "unhandled error");
    return reply.code(500).send({
      statusCode: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
  });

  // Rota inexistente tambem precisa responder no mesmo formato.
  app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(404).send({
      statusCode: 404,
      code: "ROUTE_NOT_FOUND",
      message: `Route ${request.method} ${request.url} does not exist`,
    });
  });
}
