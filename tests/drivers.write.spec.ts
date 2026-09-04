import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { resetDatabase } from "../src/data/database";
import { buildTestApp } from "./helpers/build-test-app";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildTestApp();
});

beforeEach(() => {
  resetDatabase();
});

afterAll(async () => {
  await app.close();
});

const validDriver = {
  name: "Felipe Drugovich",
  teamId: 6,
  number: 34,
};

describe("POST /drivers", () => {
  it("retorna 201 com o piloto criado e o header Location", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/drivers",
      payload: validDriver,
    });

    expect(response.statusCode).toBe(201);

    const body = response.json();

    expect(body.id).toEqual(expect.any(Number));
    expect(body).toMatchObject(validDriver);
    expect(response.headers.location).toBe(`/drivers/${body.id}`);
  });

  it("persiste o piloto criado, que passa a ser recuperavel por GET", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/drivers",
      payload: validDriver,
    });
    const { id } = created.json();

    const response = await app.inject({ method: "GET", url: `/drivers/${id}` });

    expect(response.statusCode).toBe(200);
    expect(response.json().name).toBe(validDriver.name);
  });

  it("retorna 409 quando o numero do carro ja esta em uso", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/drivers",
      payload: { ...validDriver, number: 44 }, // numero do Hamilton
    });

    expect(response.statusCode).toBe(409);
    expect(response.json().code).toBe("CONFLICT");
  });

  it("retorna 400 com codigo INVALID_REFERENCE quando o teamId nao existe", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/drivers",
      payload: { ...validDriver, teamId: 999 },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().code).toBe("INVALID_REFERENCE");
  });

  it("retorna 400 listando todos os campos obrigatorios ausentes", async () => {
    const response = await app.inject({ method: "POST", url: "/drivers", payload: {} });

    expect(response.statusCode).toBe(400);

    const body = response.json();

    expect(body.code).toBe("VALIDATION_ERROR");
    expect(body.details).toHaveLength(3);
  });

  it("retorna 400 quando o body traz campo fora do contrato", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/drivers",
      payload: { ...validDriver, championships: 3 },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().code).toBe("VALIDATION_ERROR");
  });

  it("retorna 400 quando o numero do carro esta fora da faixa 1-99", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/drivers",
      payload: { ...validDriver, number: 150 },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().details[0].field).toBe("number");
  });
});

describe("PUT /drivers/:id", () => {
  it("atualiza o piloto permitindo que ele mantenha o proprio numero", async () => {
    const response = await app.inject({
      method: "PUT",
      url: "/drivers/20",
      payload: { name: "Gabriel Bortoleto Silva", teamId: 10, number: 5 },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      id: 20,
      name: "Gabriel Bortoleto Silva",
      teamId: 10,
      number: 5,
    });
  });

  it("retorna 409 ao tentar assumir o numero de outro piloto", async () => {
    const response = await app.inject({
      method: "PUT",
      url: "/drivers/20",
      payload: { name: "Gabriel Bortoleto", teamId: 10, number: 44 },
    });

    expect(response.statusCode).toBe(409);
  });

  it("retorna 404 quando o piloto nao existe", async () => {
    const response = await app.inject({
      method: "PUT",
      url: "/drivers/999",
      payload: validDriver,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json().code).toBe("NOT_FOUND");
  });
});

describe("DELETE /drivers/:id", () => {
  it("retorna 204 sem corpo e o piloto deixa de existir", async () => {
    const response = await app.inject({ method: "DELETE", url: "/drivers/20" });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe("");

    const afterDelete = await app.inject({ method: "GET", url: "/drivers/20" });

    expect(afterDelete.statusCode).toBe(404);
  });

  it("libera o numero do carro para reuso apos a remocao", async () => {
    await app.inject({ method: "DELETE", url: "/drivers/5" }); // Verstappen, numero 1

    const response = await app.inject({
      method: "POST",
      url: "/drivers",
      payload: { ...validDriver, number: 1 },
    });

    expect(response.statusCode).toBe(201);
  });

  it("retorna 404 quando o piloto nao existe", async () => {
    const response = await app.inject({ method: "DELETE", url: "/drivers/999" });

    expect(response.statusCode).toBe(404);
  });
});
