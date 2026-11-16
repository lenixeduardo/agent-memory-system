import { createHash } from 'node:crypto';
export const hash = text => createHash('sha256').update(text).digest('hex');
export function assertScope(tenantId, projectId) {
 for (const x of [tenantId,projectId]) if (typeof x!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(x)) throw new Error('Invalid scope');
}
export function validateTask(input) {
 if (!input || typeof input!=='object') throw new Error('Invalid task');
 assertScope(input.tenantId,input.projectId);
 if(typeof input.task!=='string'||input.task.trim().length<3||input.task.length>8000) throw new Error('Invalid task');
 return input;
}
export const redact = message => String(message).replace(/(AIza[A-Za-z0-9_-]{20,}|postgres(?:ql)?:\/\/[^\s]+)/g,'[REDACTED]');
