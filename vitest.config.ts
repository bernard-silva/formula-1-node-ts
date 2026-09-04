import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node, e nao browser: estamos testando uma API, nao interface.
    environment: "node",
    include: ["tests/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      // server.ts so abre porta e os tipos nao tem logica para cobrir.
      exclude: ["src/server.ts", "src/models/**"],
    },
  },
});
