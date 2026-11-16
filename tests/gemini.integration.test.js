import test from 'node:test';
import assert from 'node:assert/strict';
import {executeTask} from '../src/agent.js';
import {pool} from '../src/db.js';
test('real Gemini via Mastra with PostgreSQL execution log',{skip:!process.env.RUN_LLM_INTEGRATION},async()=>{
 const tenant='llmtest_'+Date.now(),project='sample';
 try {
  const result=await executeTask({tenantId:tenant,projectId:project,task:'Respond with a short greeting in Portuguese.'});
  assert.ok(result.outcome.length>0);
  const r=await pool.query('SELECT success FROM executions WHERE tenant_id=$1 AND project_id=$2',[tenant,project]);
  assert.equal(r.rows[0].success,true);
 }finally {
  await pool.query('DELETE FROM executions WHERE tenant_id=$1',[tenant]);
  await pool.end();
 }
});
