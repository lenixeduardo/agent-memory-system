import http from 'node:http';
import {timingSafeEqual} from 'node:crypto';
import {executeTask} from './agent.js';
import {listMemory,approveMemory,updateMemory,pool} from './db.js';
import {listSkills} from './skills.js';
import {dream} from './dream.js';
import {assertScope,redact} from './core.js';
const token=process.env.API_TOKEN;
if(!token||token.length<24)throw new Error('API_TOKEN must have at least 24 characters');
const respond=(res,status,body)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(body));};
const auth=req=>{const a=Buffer.from(req.headers.authorization||'');const b=Buffer.from('Bearer '+token);return a.length===b.length&&timingSafeEqual(a,b);};
async function body(req){let s='';for await(const chunk of req){s+=chunk;if(s.length>20000)throw new Error('Body too large');}return JSON.parse(s||'{}');}
const server=http.createServer(async(req,res)=>{
 const started=Date.now();let status=200;
 try {
  const url=new URL(req.url,'http://localhost');
  if(req.method==='GET'&&url.pathname==='/health'){await pool.query('SELECT 1');return respond(res,200,{ok:true});}
  if(!auth(req)){status=401;return respond(res,401,{error:'Unauthorized'});}
  if(req.method==='GET'&&url.pathname==='/skills')return respond(res,200,{skills:await listSkills()});
  if(req.method==='GET'&&url.pathname==='/memory'){const t=url.searchParams.get('tenantId'),p=url.searchParams.get('projectId');assertScope(t,p);return respond(res,200,{memories:await listMemory(t,p,url.searchParams.get('status')||'approved')});}
  if(req.method==='POST'&&url.pathname==='/tasks')return respond(res,200,await executeTask(await body(req)));
  if(req.method==='POST'&&url.pathname==='/dream'){const b=await body(req);return respond(res,200,await dream(b.tenantId,b.projectId));}
  if(req.method==='POST'&&url.pathname==='/memory/approve'){const b=await body(req);return respond(res,200,{approved:await approveMemory(b.tenantId,b.projectId,b.id,b.expectedVersion)});}
  if(req.method==='POST'&&url.pathname==='/memory/update'){const b=await body(req);return respond(res,200,{updated:await updateMemory(b.tenantId,b.projectId,b.id,b.expectedHash,b.content)});}
  status=404;return respond(res,404,{error:'Not found'});
 }catch(e){status=400;respond(res,400,{error:redact(e.message)});}
 finally{console.log(JSON.stringify({event:'request',method:req.method,path:req.url?.split('?')[0],status,durationMs:Date.now()-started}));}
});
server.listen(Number(process.env.PORT||3000),'127.0.0.1',()=>console.log('Agent Memory API listening'));
