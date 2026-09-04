import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildTestApp } from "./helpers/build-test-app";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildTestApp();
});

afterAll(async () => {
  await app.close();
});

describe("Aplicacao", () => {
  it("responde 404 no formato padrao para rota inexistente", async () => {
    const response = await app.inject({ method: "GET", url: "/pilotos" });

    expect(response.statusCode).toBe(404);
    expect(response.json().code).toBe("ROUTE_NOT_FOUND");
  });

  it("libera CORS para qualquer origem", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/teams",
      headers: { origin: "http://localhost:5173" },
    });

    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });
});
