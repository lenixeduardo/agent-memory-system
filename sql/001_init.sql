CREATE SCHEMA IF NOT EXISTS agent_memory;
CREATE TABLE IF NOT EXISTS agent_memory.memories (
 id BIGSERIAL PRIMARY KEY,
 tenant_id TEXT NOT NULL,
 project_id TEXT NOT NULL,
 content TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
 version INTEGER NOT NULL DEFAULT 1,
 content_hash TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS memories_scope ON agent_memory.memories(tenant_id,project_id,status);
CREATE TABLE IF NOT EXISTS agent_memory.executions (
 id BIGSERIAL PRIMARY KEY,
 tenant_id TEXT NOT NULL,
 project_id TEXT NOT NULL,
 task TEXT NOT NULL,
 outcome TEXT NOT NULL,
 success BOOLEAN NOT NULL,
 duration_ms INTEGER NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS executions_scope ON agent_memory.executions(tenant_id,project_id,created_at DESC);
