import pg from 'pg';
import { assertScope, hash } from './core.js';
export const pool = new pg.Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:5000});
export async function listMemory(tenantId,projectId,status='approved') {
 assertScope(tenantId,projectId);
 if(!['approved','pending','rejected'].includes(status)) throw new Error('Invalid status');
 const r=await pool.query('SELECT id,content,status,version,content_hash FROM agent_memory.memories WHERE tenant_id=$1 AND project_id=$2 AND status=$3 ORDER BY id DESC LIMIT 30',[tenantId,projectId,status]);
 return r.rows;
}
export async function recordExecution({tenantId,projectId,task,outcome,success,durationMs}) {
 assertScope(tenantId,projectId);
 await pool.query('INSERT INTO agent_memory.executions(tenant_id,project_id,task,outcome,success,duration_ms) VALUES($1,$2,$3,$4,$5,$6)',[tenantId,projectId,task,outcome,success,durationMs]);
}
export async function proposeMemory(tenantId,projectId,content) {
 assertScope(tenantId,projectId);
 if(typeof content!=='string'||content.length<10||content.length>12000) throw new Error('Invalid memory');
 const h=hash(content);
 const existing=await pool.query('SELECT id FROM agent_memory.memories WHERE tenant_id=$1 AND project_id=$2 AND content_hash=$3 LIMIT 1',[tenantId,projectId,h]);
 if(existing.rowCount)return {id:existing.rows[0].id,duplicate:true};
 const r=await pool.query('INSERT INTO agent_memory.memories(tenant_id,project_id,content,content_hash) VALUES($1,$2,$3,$4) RETURNING id',[tenantId,projectId,content,h]);
 return {id:r.rows[0].id,duplicate:false};
}
export async function approveMemory(tenantId,projectId,id,expectedVersion) {
 assertScope(tenantId,projectId);
 if(!Number.isInteger(Number(id))||!Number.isInteger(expectedVersion))throw new Error('Invalid version');
 const r=await pool.query("UPDATE agent_memory.memories SET status='approved',version=version+1,updated_at=now() WHERE id=$1 AND tenant_id=$2 AND project_id=$3 AND version=$4 AND status='pending' RETURNING id",[id,tenantId,projectId,expectedVersion]);
 return r.rowCount===1;
}
export async function updateMemory(tenantId,projectId,id,expectedHash,content) {
 assertScope(tenantId,projectId);
 if(typeof content!=='string'||content.length<10||content.length>12000||typeof expectedHash!=='string')throw new Error('Invalid content');
 const r=await pool.query("UPDATE agent_memory.memories SET content=$1,content_hash=$2,version=version+1,status='pending',updated_at=now() WHERE id=$3 AND tenant_id=$4 AND project_id=$5 AND content_hash=$6 RETURNING id",[content,hash(content),id,tenantId,projectId,expectedHash]);
 return r.rowCount===1;
}
