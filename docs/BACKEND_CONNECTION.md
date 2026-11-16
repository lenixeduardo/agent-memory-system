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
