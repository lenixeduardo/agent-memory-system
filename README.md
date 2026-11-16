# Agent Memory System

MVP: Mastra orchestration, Gemini, PostgreSQL memory, on-demand skills, dreaming proposals, validation and structured observability.

## Local setup
Requires Node.js 22+, Docker and a Gemini API key.

```bash
cp .env.example .env
# Set GEMINI_API_KEY and a strong API_TOKEN in .env
docker compose up -d
npm install
npm run migrate
npm test
npm start
```

Use `GET /health` for database health. Authenticated routes require `Authorization: Bearer <API_TOKEN>`.

```bash
curl -X POST http://localhost:3000/tasks -H "Authorization: Bearer $API_TOKEN" -H 'Content-Type: application/json' -d '{"tenantId":"demo","projectId":"sample","task":"Explain the purpose of a code review"}'
```

`GET /skills`, `GET /memory?tenantId=demo&projectId=sample`, `POST /dream`, `POST /memory/approve` and `POST /memory/update` are available.

Dreaming is deterministic and produces **pending** proposals from successful executions; it does not autonomously approve or rewrite instructions. All memory contents are untrusted data. The HTTP API is a single-admin-token MVP, not a multi-tenant public authorization system. Do not expose it publicly without user-level authentication and authorization. Never commit .env.

## Integration verification
Run `npm test` for unit tests. Set `DATABASE_URL` and run `npm run migrate` for real PostgreSQL migrations. Set `GEMINI_API_KEY` and submit a task to verify the real model call. These integration checks require external services and are not covered by the unit tests.
