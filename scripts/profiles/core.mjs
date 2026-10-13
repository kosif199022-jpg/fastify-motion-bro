// Shared pure helpers for user-gated prompt workflows.
export const ensure=(v,msg)=>{if(!v)throw Error(msg);};
export const copy=x=>structuredClone(x);
export const asText=x=>String(x??'').trim();
export const num=(v,min,max,label='number')=>{const n=Number(v);ensure(Number.isInteger(n)&&n>=min&&n<=max,'Invalid '+label+' (expected '+min+'..'+max+')');return n;};
export const repeated=(piece,prompts)=>prompts.every(p=>p.includes(piece));
export const section=(label,s)=>label+'\n'+s+'\n';
export function response(state,output,artifacts={}){return {state,output,artifacts};}
export function fresh(id,stage,data={}){return {schema:'fmb.profile.v1',id,stage,values:{...data},complete:false};}
export function cloneSession(s,id){ensure(s?.id===id,'Wrong session: expected '+id);ensure(!s.complete,'Session already complete; start a new one');return copy(s);}
export function wordCount(line){return asText(line).split(/\s+/).filter(Boolean).length;}
export function lockCheck(text,lock){ensure(asText(text).includes(lock),'Lock missing or altered');}
