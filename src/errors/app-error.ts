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

/**
 * 409 Conflict: a requisicao esta correta, mas colide com o estado atual.
 * Usado quando o numero do carro ja pertence a outro piloto.
 */
export function conflict(message: string): AppError {
  return new AppError(message, 409, "CONFLICT");
}

/**
 * 400 com codigo proprio: o payload passou pelo schema mas aponta para um
 * recurso que nao existe. O schema sabe validar que teamId e um inteiro
 * positivo; nao tem como saber se o time 999 existe. Regra de dados e regra de
 * negocio, logo mora no service.
 */
export function invalidReference(message: string): AppError {
  return new AppError(message, 400, "INVALID_REFERENCE");
}
