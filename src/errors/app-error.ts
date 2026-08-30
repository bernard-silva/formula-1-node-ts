/**
 * Erro de aplicacao.
 *
 * Carrega o status HTTP e um codigo estavel junto da mensagem. Quem lanca nao
 * precisa saber como a resposta e montada; quem monta a resposta (o error
 * handler) nao precisa saber de que regra o erro veio.
 *
 * O "code" existe para o cliente tratar programaticamente. Mensagem e texto
 * para humano e pode mudar; codigo e contrato e nao muda.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function notFound(resource: string, id: number): AppError {
  return new AppError(`${resource} with id ${id} was not found`, 404, "NOT_FOUND");
}
