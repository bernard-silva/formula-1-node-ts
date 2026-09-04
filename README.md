# F1 API — evolução do desafio `node-formula-1` (DIO)

API REST de times e pilotos de Fórmula 1 em **Node.js + TypeScript + Fastify**, com arquitetura em camadas, CRUD de pilotos, validação por contrato, documentação OpenAPI e testes automatizados rodando em CI.

Projeto desenvolvido a partir do desafio [`digitalinnovationone/node-formula-1`](https://github.com/digitalinnovationone/node-formula-1) da [Digital Innovation One](https://www.dio.me/). Após reproduzir o projeto-base, evoluí a arquitetura, corrigi defeitos encontrados no código original e adicionei validação, testes e documentação.

![CI](https://github.com/bernard-silva/formula-1-node-ts/actions/workflows/ci.yml/badge.svg)

---

## Stack

| Ferramenta | Papel |
|---|---|
| Node.js 20+ | Runtime (`--env-file` nativo, sem dotenv) |
| TypeScript 5 | Tipagem estática em modo `strict` |
| Fastify 4 | Framework HTTP com validação por JSON Schema |
| `@fastify/swagger` | Documentação OpenAPI gerada dos schemas |
| Vitest | Testes e cobertura |
| GitHub Actions | Integração contínua |

---

## Como rodar

Requer Node.js 20.6 ou superior.

```bash
git clone https://github.com/bernard-silva/formula-1-node-ts.git
cd formula-1-node-ts
npm install
cp .env.example .env
npm run dev
```

Servidor em `http://localhost:3333` e documentação interativa em **`http://localhost:3333/docs`**.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor com hot reload |
| `npm test` | Suíte de testes |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run typecheck` | Verificação de tipos |
| `npm run build` | Build de produção |

---

## Endpoints

| Método | Rota | Descrição | Status |
|---|---|---|---|
| `GET` | `/teams` | Lista times | 200 |
| `GET` | `/teams/:id` | Time por id | 200, 400, 404 |
| `GET` | `/drivers` | Lista pilotos (`?teamId=`, `?name=`) | 200, 400 |
| `GET` | `/drivers/:id` | Piloto por id | 200, 400, 404 |
| `GET` | `/drivers/:id/team` | Time do piloto | 200, 400, 404 |
| `POST` | `/drivers` | Cria piloto | 201, 400, 409 |
| `PUT` | `/drivers/:id` | Atualiza piloto | 200, 400, 404, 409 |
| `DELETE` | `/drivers/:id` | Remove piloto | 204, 400, 404 |
| `GET` | `/docs` | Documentação Swagger | 200 |

### Regras de negócio

- Número de carro é único no grid — um piloto pode manter o próprio número num update
- Piloto só pode ser criado ou transferido para um time existente
- O `id` é gerado pela aplicação, nunca recebido do cliente

### Formato de resposta

Sucesso devolve o recurso direto (`GET /drivers/8`):

```json
{ "id": 8, "name": "Lewis Hamilton", "teamId": 4, "number": 44 }
```

Erro sai sempre no mesmo envelope, com um código estável para o cliente tratar:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": [{ "field": "number", "message": "must be <= 99" }]
}
```

| Código | HTTP | Quando |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Params, query ou body fora do schema |
| `INVALID_REFERENCE` | 400 | Payload aponta para um time inexistente |
| `BAD_REQUEST` | 400 | JSON malformado |
| `NOT_FOUND` | 404 | Recurso da URL não existe |
| `ROUTE_NOT_FOUND` | 404 | Rota inexistente |
| `CONFLICT` | 409 | Número de carro já em uso |
| `INTERNAL_SERVER_ERROR` | 500 | Erro não previsto (detalhe vai para o log, não para a resposta) |

`message` é texto para humano e pode mudar. `code` é contrato e não muda — é nele que os testes se apoiam.

---

## Arquitetura

O projeto original resolvia tudo num único `server.ts`. Separei em camadas com uma responsabilidade cada:

```
GET /drivers/8
   ↓
routes/       declara URL -> handler e o contrato de validação
   ↓
controllers/  traduz HTTP: lê a requisição, escolhe o status
   ↓
services/     regras de negócio — não conhece HTTP
   ↓
data/         os dados (arrays em memória)
```

```
src/
├── server.ts       # bootstrap: único arquivo que abre porta
├── app.ts          # buildApp(): monta a aplicação
├── models/         # tipos de domínio
├── data/           # dados e geração de id
├── services/       # regras de negócio
├── controllers/    # camada HTTP
├── routes/         # declaração das rotas
├── schemas/        # JSON Schema (validação + documentação)
├── errors/         # erro de aplicação com status e código
└── plugins/        # error handler e Swagger
```

### Decisões que valem explicação

**`buildApp()` separado do `server.ts`.** No original, criar a aplicação e colocá-la em escuta aconteciam no mesmo arquivo, o que torna teste automatizado inviável: não havia como obter a aplicação pronta sem abrir uma porta TCP. Separados, os testes chamam `buildApp()` e usam `app.inject()` para exercitar o ciclo completo de requisição/resposta em memória.

**Validação por JSON Schema, não por código.** Cada rota declara seu contrato e o Fastify recusa a requisição antes do handler rodar. O mesmo schema alimenta a documentação em `/docs`, então documentação e validação não têm como divergir.

**O service não conhece HTTP.** Ele recebe e devolve tipos de domínio e lança `AppError` quando a regra é violada. Um único error handler traduz para status code. Sem isso, cada handler precisaria do seu `try/catch` e o formato do erro divergiria entre rotas.

**`removeAdditional: false` no ajv.** O padrão do Fastify é `true`, que **descarta em silêncio** campos fora do schema. Um cliente que erra o nome de um campo receberia 201 acreditando que salvou. Com `false`, o `additionalProperties: false` recusa de verdade. Também ativei `allErrors: true` para reportar todas as violações de uma vez.

**Error handler aplicado na instância raiz, não via `app.register()`.** O `setErrorHandler` respeita a encapsulação do Fastify: registrado dentro de um plugin, valeria só para as rotas daquele contexto, e as rotas dos contextos irmãos cairiam no handler padrão — a API responderia erro em dois formatos diferentes dependendo da rota.

---

## Defeitos encontrados no código original

Levantados por inspeção antes de qualquer refatoração. Os dois primeiros têm teste de regressão na suíte.

**1. `id` duplicado deixando registro inacessível**

```ts
{ id: 2, name: "Lewis Hamilton", team: "Ferrari" },
{ id: 2, name: "Lando Norris",   team: "McLaren" },
```

`drivers.find(d => d.id === 2)` devolve a primeira ocorrência e para. O registro do Norris existia na coleção e **não havia URL capaz de retorná-lo**.

Corrigido na origem: o `id` deixou de fazer parte do dado de entrada (`Omit<Driver, "id">`) e passou a ser gerado na inserção, o que torna a duplicidade impossível por construção — e não apenas corrigida no dado atual.

**2. `id` não numérico tratado como 404**

`parseInt("abc")` resulta em `NaN`, nenhum piloto casa, e a API respondia `404`. Erro de cliente disfarçado de recurso inexistente. `parseInt("1.9")` era pior: devolvia `1` e aceitava entrada inválida em silêncio. Corrigido com JSON Schema (`type: "integer", minimum: 1`), que agora responde 400.

**3. Vínculo entre piloto e time por texto livre**

O campo era `team: "Ferrari"`. Um typo desliga o vínculo silenciosamente e renomear um time exige atualizar todos os pilotos. Trocado por `teamId`, como faria qualquer modelo relacional.

**4. `PORT` do `.env` ignorada**

O `.env` declarava `PORT=3333` e o script passava `--env-file=.env`, mas o código chamava `listen({ port: 3333 })` com valor fixo. Mudar o `.env` não tinha efeito — falha que só apareceria no deploy, quando a plataforma injeta outra porta.

**5. Configuração do repositório**

`.env` versionado com `.gitignore` contendo apenas `node_modules/`, e script `start:dist` apontando para um caminho que o build nunca gera.

---

## Estratégia de testes

25 casos em quatro arquivos, todos via `app.inject()`.

```
tests/
├── app.spec.ts            # 404 padronizado, CORS
├── teams.spec.ts          # leitura de times
├── drivers.read.spec.ts   # leitura, filtros e regressões
└── drivers.write.spec.ts  # POST, PUT e DELETE
```

**`app.inject()` em vez de requisição HTTP real.** O Fastify embute o `light-my-request`, que entrega a requisição direto na instância. O ciclo exercitado é idêntico — roteamento, validação, handler, serialização — mas sem socket. Resultado: sem servidor para subir, sem porta para escolher, sem conflito ao rodar em paralelo, sem flakiness de rede.

**Isolamento por construção.** A aplicação é montada uma vez por arquivo (`beforeAll`), porque não guarda estado. Os dados guardam, então `resetDatabase()` roda antes de **cada** teste (`beforeEach`). Sem isso, um `POST` de um teste seria encontrado pelo teste seguinte e a suíte passaria a depender da ordem de execução — cada caso passa isolado e a suíte falha inteira, ou pior, falha de forma intermitente.

**Cenário negativo tem o mesmo peso do positivo.** Boa parte dos casos verifica recusa: 400, 404 e 409. É onde as APIs costumam divergir do que a documentação promete.

**Asserções escolhidas pela qualidade do diagnóstico.** Comparo a lista de nomes com `toEqual` em vez de usar `every()`: quando falha, o relatório mostra o diff e eu sei qual item vazou, em vez de apenas "expected false to be true".

**Testes apoiados no `code`, nunca na `message`.** Mensagem é texto para humano e pode ser reescrita a qualquer momento; código é contrato. Teste amarrado em mensagem quebra em toda melhoria de texto — e aí a equipe começa a ignorar teste vermelho.

**Coleção do Postman** em `docs/`, com assertivas em cada request e o fluxo de CRUD encadeado por variável de coleção. Importável e executável pelo Collection Runner.

---

## Integração contínua

`.github/workflows/ci.yml` roda em todo push e pull request: instala com `npm ci`, verifica tipagem com `tsc --noEmit` e executa a suíte. Erro de tipo reprova antes de qualquer teste rodar.

---

## Próximos passos

- [ ] Persistência real com PostgreSQL
- [ ] CRUD completo de times
- [ ] Paginação nas listagens
- [ ] Teste de carga com JMeter nos endpoints de listagem
- [ ] Autenticação nas rotas de escrita
- [ ] Dockerfile

---

## Créditos


Desafio proposto pela [Digital Innovation One](https://www.dio.me/) — projeto base em [`digitalinnovationone/node-formula-1`](https://github.com/digitalinnovationone/node-formula-1).

Desenvolvido por **Bernard Silva** como projeto de portfólio, com o código CRUD 
gerado com auxílio do Claude (Anthropic) e a suíte de testes escrita manualmente como desafio de QA e suporte do Claude.

Dados dos times e pilotos são ilustrativos, baseados na temporada de 2025.
