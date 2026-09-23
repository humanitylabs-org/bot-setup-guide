import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker, { relay } from './worker.mjs';
const legacyText = await readFile(new URL('../api/hostinger.js', import.meta.url), 'utf8');
const { default: legacy } = await import('data:text/javascript;base64,' + Buffer.from(legacyText).toString('base64'));
const input = {apiKey:'synthetic-test-only', method:'GET', path:'/api/vps/v1/virtual-machines'};
const req = (body=input, method='POST') => new Request('https://www.botsetupguide.com/api/hostinger', {method, ...(method==='POST'?{body:JSON.stringify(body), headers:{'Content-Type':'application/json'}}:{})});
for (const [status,text] of [[200,'[{"id":123}]'],[201,'{"id":456}'],[202,'{"state":"pending"}'],[401,'{"message":"Unauthenticated"}'],[429,'{"message":"Rate limited"}'],[502,'Bad gateway']]) {
 test(`Legacy response parity ${status}`, async()=>{
  const mock = async()=>new Response(text,{status});
  const real = globalThis.fetch; globalThis.fetch=mock;
  let legacyBody, legacyStatus;
  try {await legacy({method:'POST',body:input},{status(s){legacyStatus=s;return this;},json(b){legacyBody=b;}});} finally {globalThis.fetch=real;}
  const actual=await relay(req(),mock);
  assert.equal(actual.status,legacyStatus);assert.deepEqual(await actual.json(),legacyBody);
  assert.equal(actual.headers.get('Cache-Control'),'no-store');
 });
}
test('Rejects wrong method and missing fields without upstream call',async()=>{
 const no=()=>{throw new Error('must not call');};
 assert.equal((await relay(req(input,'GET'),no)).status,405);
 assert.equal((await relay(req({}),no)).status,400);
 assert.equal((await relay(req(null),no)).status,400);
 assert.equal((await relay(new Request('https://test/api/hostinger',{method:'POST',body:'{' }),no)).status,400);
});
test('Forwards synthetic provisioning inputs without real provider actions',async()=>{
 for(const path of ['/api/vps/v1/post-install-scripts','/api/vps/v1/virtual-machines/123/recreate']){
  const body={name:'synthetic',template_id:1002,post_install_script_id:456};
  const r=await relay(req({...input,method:'POST',path,body}),async(url,opts)=>{
   assert.equal(url,'https://developers.hostinger.com'+path);assert.equal(opts.method,'POST');
   assert.equal(opts.headers.Authorization,'Bearer synthetic-test-only');assert.equal(opts.body,JSON.stringify(body));assert.equal(opts.redirect,'manual');
   return Response.json({id:456},{status:201});
  }); assert.equal(r.status,201);
 }
});
test('Cannot redirect credentials to another origin',async()=>{
 for(const path of ['@evil.example/a','//evil.example/a','\\@evil.example/a','https://evil.example/a']) {
  let called=false;assert.equal((await relay(req({...input,path}),async()=>{called=true;})).status,400);assert.equal(called,false);
 }
});
test('Redirects are rejected without a second credential-bearing request',async()=>{
 let calls=0;
 const r=await relay(req(),async()=>{calls++;return new Response(null,{status:302,headers:{Location:'https://elsewhere.example/'}});});
 assert.equal(calls,1);assert.equal(r.status,502);assert.equal((await r.text()).includes(input.apiKey),false);
});
test('Network failures do not echo keys or exception text',async()=>{
 const r=await relay(req(),async()=>{throw new Error('synthetic-test-only');});assert.equal(r.status,500);assert.equal((await r.text()).includes(input.apiKey),false);
});
test('No-body upstream status is preserved',async()=>assert.equal((await relay(req(),async()=>new Response(null,{status:204}))).status,204));
test('Apex redirects preserve method-compatible status, path and query',async()=>{
 const r=await worker.fetch(new Request('https://botsetupguide.com/upgrade?x=1'),{});assert.equal(r.status,307);assert.equal(r.headers.get('location'),'https://www.botsetupguide.com/upgrade?x=1');
});
test('Home and upgrade rewrite only exact paths',async()=>{
 for(const [path,expected] of [['/','/index.html'],['/upgrade','/index.html'],['/upgrade/','/upgrade/'],['/index.html','/index.html'],['/missing','/missing']]) {
  await worker.fetch(new Request('https://www.botsetupguide.com'+path+'?x=1'),{ASSETS:{fetch(r){assert.equal(new URL(r.url).pathname,expected);assert.equal(new URL(r.url).search,'?x=1');return new Response('ok');}}});
 }
});
