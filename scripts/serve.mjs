import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../', import.meta.url));
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
createServer(async(req,res)=>{
 try {
  let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(name==='/') name='/web/index.html';
  const file=resolve(root,'.'+name);
  if(file!==root && !file.startsWith(root+sep)) {res.writeHead(403).end();return;}
  if(!/^\/(web|project|assets|examples)\//.test(name)) {res.writeHead(403).end();return;}
  if((await stat(file)).isDirectory()) {res.writeHead(403).end();return;}
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);
 } catch {res.writeHead(404).end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log('Fastify Motion Bro preview http://127.0.0.1:'+port));
