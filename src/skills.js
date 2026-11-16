import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('skills');
export async function listSkills() {
 const entries=await readdir(root,{withFileTypes:true});
 const skills=[];
 for(const entry of entries) {
  if(!entry.isDirectory()||!/^[a-z0-9-]+$/.test(entry.name))continue;
  const text=await readFile(path.join(root,entry.name,'SKILL.md'),'utf8');
  const description=text.match(/^description:\s*(.*)$/m)?.[1]||'';
  const keywords=text.match(/^keywords:\s*(.*)$/m)?.[1]||'';
  skills.push({name:entry.name,description,keywords});
 }
 return skills;
}
export function chooseSkills(task,skills) {
 const words=new Set(task.toLowerCase().match(/[a-z]{3,}/g)||[]);
 return skills.filter(s=>(s.keywords+' '+s.name).toLowerCase().split(/[^a-z]+/).some(w=>w.length>3&&words.has(w))).slice(0,3);
}
export async function loadSkill(name) {
 if(!/^[a-z0-9-]+$/.test(name))throw new Error('Invalid skill');
 return (await readFile(path.join(root,name,'SKILL.md'),'utf8')).slice(0,12000);
}
