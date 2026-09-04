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

describe("GET /teams", () => {
  it("retorna 200 e a lista completa de times", async () => {
    const response = await app.inject({ method: "GET", url: "/teams" });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body).toHaveLength(10);
    expect(body[0]).toEqual({ id: 1, name: "McLaren", base: "Woking, United Kingdom" });
  });
});

describe("GET /teams/:id", () => {
  it("retorna 200 e o time solicitado", async () => {
    const response = await app.inject({ method: "GET", url: "/teams/4" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      id: 4,
      name: "Ferrari",
      base: "Maranello, Italy",
    });
  });

  it("retorna 404 quando o time nao existe", async () => {
    const response = await app.inject({ method: "GET", url: "/teams/999" });

    expect(response.statusCode).toBe(404);
    expect(response.json().code).toBe("NOT_FOUND");
  });

  it("retorna 400 quando o id nao e numerico", async () => {
    const response = await app.inject({ method: "GET", url: "/teams/abc" });

    expect(response.statusCode).toBe(400);
    expect(response.json().code).toBe("VALIDATION_ERROR");
  });
});
