import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { resetDatabase } from "../src/data/database";
import type { Driver } from "../src/models";
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

describe("GET /drivers", () => {
  it("retorna 200 e a lista completa de pilotos", async () => {
    const response = await app.inject({ method: "GET", url: "/drivers" });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body).toHaveLength(20);
    expect(body[0]).toEqual({ id: 1, name: "Lando Norris", teamId: 1, number: 4 });
  });

  it("filtra pilotos por teamId", async () => {
    const response = await app.inject({ method: "GET", url: "/drivers?teamId=4" });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body).toHaveLength(2);
    expect(body.map((driver: Driver) => driver.name)).toEqual([
      "Charles Leclerc",
      "Lewis Hamilton",
    ]);
  });

  it("busca pilotos por parte do nome, ignorando maiusculas", async () => {
    const response = await app.inject({ method: "GET", url: "/drivers?name=HAMIL" });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body).toHaveLength(1);
    expect(body[0].name).toBe("Lewis Hamilton");
  });

  it("retorna lista vazia quando o filtro nao encontra ninguem", async () => {
    const response = await app.inject({ method: "GET", url: "/drivers?name=zzzz" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it("retorna 400 quando teamId nao e numerico", async () => {
    const response = await app.inject({ method: "GET", url: "/drivers?teamId=ferrari" });

    expect(response.statusCode).toBe(400);
    expect(response.json().code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /drivers/:id", () => {
  it("retorna 200 e o piloto solicitado", async () => {
    const response = await app.inject({ method: "GET", url: "/drivers/8" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      id: 8,
      name: "Lewis Hamilton",
      teamId: 4,
      number: 44,
    });
  });

  it("retorna 404 com codigo NOT_FOUND quando o piloto nao existe", async () => {
    const response = await app.inject({ method: "GET", url: "/drivers/999" });

    expect(response.statusCode).toBe(404);

    const body = response.json();

    expect(body.code).toBe("NOT_FOUND");
    expect(body.statusCode).toBe(404);
  });

  it("retorna 400 com codigo VALIDATION_ERROR quando o id nao e numerico", async () => {
    const response = await app.inject({ method: "GET", url: "/drivers/abc" });

    expect(response.statusCode).toBe(400);

    const body = response.json();

    expect(body.code).toBe("VALIDATION_ERROR");
    expect(body.details[0].field).toBe("id");
  });

  it("garante que todos os pilotos do seed tem id unico e alcancavel", async () => {
    const list = await app.inject({ method: "GET", url: "/drivers" });
    const ids: number[] = list.json().map((driver: Driver) => driver.id);

    expect(new Set(ids).size).toBe(ids.length);

    for (const id of ids) {
      const response = await app.inject({ method: "GET", url: `/drivers/${id}` });
      expect(response.statusCode).toBe(200);
    }
  });
});

describe("GET /drivers/:id/team", () => {
  it("retorna 200 e o time do piloto", async () => {
    const response = await app.inject({ method: "GET", url: "/drivers/8/team" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      id: 4,
      name: "Ferrari",
      base: "Maranello, Italy",
    });
  });

  it("retorna 404 quando o piloto nao existe", async () => {
    const response = await app.inject({ method: "GET", url: "/drivers/999/team" });

    expect(response.statusCode).toBe(404);
    expect(response.json().code).toBe("NOT_FOUND");
  });
});
