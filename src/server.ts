import { buildApp } from "./app";

/**
 * Bootstrap: o unico arquivo que abre porta.
 *
 * A porta agora vem do ambiente. No original, o .env declarava PORT=3333 e o
 * script passava --env-file=.env, mas o codigo chamava listen({ port: 3333 })
 * com valor fixo -- mudar o .env nao tinha efeito nenhum. Falha que so apareceria
 * no deploy, quando a plataforma injeta outra porta.
 */
async function main() {
  const port = Number(process.env.PORT) || 3333;
  const app = await buildApp();

  try {
    await app.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void main();
