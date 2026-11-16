# Banco PostgreSQL compartilhado — Agent Memory System

## Infraestrutura
- Supabase: conta **Primary**, organização **eduorg**
- Projeto PostgreSQL existente: **TCGScan**
- Project ref: `ddiqrryapdimhuzvjtxn`
- Região: `sa-east-1` (São Paulo)
- Schema privado exclusivo: `agent_memory`
- Tabelas: `agent_memory.memories` e `agent_memory.executions`
- Migração aplicada: `agent_memory_private_schema_initial`

O projeto Supabase é **compartilhado com TCGScan** devido ao limite de dois projetos gratuitos na organização. O Agent Memory System **não possui um projeto Supabase próprio**. Não alterar, remover ou migrar tabelas do TCGScan para manter o Agent Memory System.

## Segurança
O schema não deve ser exposto na Data API. Não conceder acesso a `anon` ou `authenticated`. A aplicação deve se conectar **somente pelo backend**, usando credenciais PostgreSQL guardadas em variáveis de ambiente. A verificação de privilégios confirmou `USAGE=false` para ambos os papéis.

## Configuração da aplicação
Configure `DATABASE_URL` com a connection string PostgreSQL do projeto TCGScan, obtida no painel Supabase. Não comite a senha. As queries da aplicação precisam usar o schema `agent_memory`. A versão inicial do código ainda usa nomes de tabelas sem qualificação; configure o `search_path` ou qualifique explicitamente as tabelas antes de executar o serviço em produção.

**Recomendado:** um usuário PostgreSQL dedicado, com permissões apenas no schema `agent_memory`; não use credenciais privilegiadas do TCGScan em produção.

## Migração e validação
A migração remota já foi aplicada. Não execute o script inicial `sql/001_init.sql` sem adaptá-lo ao schema `agent_memory`; o script original cria tabelas sem qualificação de schema. Para testes de integração, use um banco de testes separado ou identifique rigorosamente o escopo dos registros de teste. O PostgreSQL é compartilhado e a limpeza acidental de dados é inaceitável.

## Verificações efetuadas
- Migração retornou sucesso.
- `has_schema_privilege('anon','agent_memory','USAGE')`: false.
- `has_schema_privilege('authenticated','agent_memory','USAGE')`: false.
- Conexão real da aplicação e testes integrados ainda pendentes.
