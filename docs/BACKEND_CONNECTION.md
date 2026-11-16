# Backend PostgreSQL: acesso dedicado

Projeto Supabase compartilhado: **TCGScan** (`ddiqrryapdimhuzvjtxn`), conta **Primary**. Schema privado: `agent_memory`.

## Papel criado
`agent_memory_backend` foi criado com `NOLOGIN`, sem superusuário ou permissão para criar bancos. Recebeu `USAGE` no schema, DML nas tabelas e uso das sequências do schema. A migração aplicada é `agent_memory_backend_limited_role`. A verificação de permissões confirmou os privilégios necessários.

## Ativação
O papel ainda **não pode se conectar**: requer ativação de LOGIN e senha gerada/armazenada de forma segura. A string `DATABASE_URL` deve ser configurada como segredo **somente no backend**, com TLS, usando o host e o modo de conexão fornecidos pelo botão **Connect** do projeto Supabase. Nunca commitar credenciais. Para hospedagem IPv4-only, utilizar o Session Pooler do Supabase; o nome de usuário e o host devem seguir exatamente os dados fornecidos pelo painel.

Exemplo genérico (não é uma conexão funcional até preencher):
```env
DATABASE_URL=postgresql://<backend-user>:<password>@<supabase-db-or-session-pooler-host>:5432/postgres?sslmode=require
```

As queries do aplicativo usam `agent_memory.memories` e `agent_memory.executions`, não tabelas públicas. Não use a senha de administrador do TCGScan.

## Estado
- Papel e grants aplicados no banco real.
- LOGIN e segredo pendentes.
- Deployment/backend não identificado.
- Conectividade e testes de integração ainda pendentes.

## Vercel Primary
- Project: `agent-memory-system`
- Vercel project ID: `prj_aPiYqvGhssDaYuNqCg1IUTBCr9Pr`
- Vercel team ID: `team_ZaeDYeP5PrCRGzrB5XV62Jys`
- GitHub: `lenixeduardo/agent-memory-system`
- Serverless entrypoint: `api/index.js`, HTTP handler: `src/server.js`
- Function region: `gru1` (São Paulo)
- Git integration configured; deployment and database connection **not yet validated**.

### Secrets required on Vercel
Set `DATABASE_URL` as a sensitive environment variable with the PostgreSQL session-pooler connection string and TLS. Set `API_TOKEN` as sensitive with at least 24 random characters. Set `GEMINI_API_KEY` as sensitive. Never store real values in GitHub.

The PostgreSQL role `agent_memory_backend` is currently `NOLOGIN`; create/activate a dedicated LOGIN role with a strong password before configuring `DATABASE_URL`. The role's privileges must remain limited to the `agent_memory` schema. Use the exact pooler hostname and username provided by Supabase, and verify custom-role support for that connection mode.
