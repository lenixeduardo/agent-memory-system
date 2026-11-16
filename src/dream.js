import {pool,proposeMemory} from './db.js';
import {assertScope} from './core.js';
export function summarizeExperience(row) {
 if(!row.success||!row.outcome||row.outcome.startsWith('ERROR:'))return null;
 return ('Task: '+row.task.slice(0,1000)+'\nObserved outcome: '+row.outcome.slice(0,3000)).slice(0,4000);
}
export async function dream(tenantId,projectId) {
 assertScope(tenantId,projectId);
 const r=await pool.query('SELECT task,outcome,success FROM executions WHERE tenant_id=$1 AND project_id=$2 ORDER BY id DESC LIMIT 20',[tenantId,projectId]);
 const proposals=[];
 for(const row of r.rows){const text=summarizeExperience(row);if(text)proposals.push(await proposeMemory(tenantId,projectId,text));}
 return {scanned:r.rowCount,proposals:proposals.filter(p=>!p.duplicate).length,duplicates:proposals.filter(p=>p.duplicate).length};
}
