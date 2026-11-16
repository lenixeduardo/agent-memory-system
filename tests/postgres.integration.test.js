import test from 'node:test';
import assert from 'node:assert/strict';
import {pool,proposeMemory,listMemory,approveMemory,updateMemory} from '../src/db.js';
import {hash} from '../src/core.js';
test('real PostgreSQL memory lifecycle', {skip:!process.env.RUN_DB_INTEGRATION}, async()=>{
 const tenant='integration_'+Date.now(),project='isolated';
 try {
  const inserted=await proposeMemory(tenant,project,'Persistent integration test memory');
  assert.equal(inserted.duplicate,false);
  assert.equal((await listMemory(tenant,project)).length,0);
  assert.equal(await approveMemory(tenant,project,inserted.id,1),true);
  assert.equal(await approveMemory(tenant,project,inserted.id,1),false);
  assert.equal((await listMemory(tenant,project)).length,1);
  assert.equal(await updateMemory(tenant,project,inserted.id,hash('wrong'),'Changed content for test'),false);
  assert.equal(await updateMemory(tenant,project,inserted.id,hash('Persistent integration test memory'),'Changed content for test'),true);
  assert.equal((await listMemory(tenant,project)).length,0);
 } finally {
  await pool.query('DELETE FROM agent_memory.memories WHERE tenant_id=$1',[tenant]);
  await pool.end();
 }
});
