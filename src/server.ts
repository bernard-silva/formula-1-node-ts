import { buildApp } from "./app";

async function main() {
  const port = Number(process.env.PORT) || 3333;
  const app = await buildApp();

  try {
    await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`Documentacao disponivel em http://localhost:${port}/docs`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void main();
