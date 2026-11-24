const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {test}=require('node:test');
const url=s=>`data:text/javascript;base64,${Buffer.from(s).toString('base64')}`;
const source=p=>readFileSync(`${__dirname}/src/app/${p}`,'utf8').replace(/^\uFEFF/,'');
const guards=import(url(source('lib/requestGuard.js')));
const display=import(url(source('lib/display.js')));
const nextStub=url('export const NextResponse={json:(d,o={})=>new Response(JSON.stringify(d),{status:o.status||200,headers:{"Content-Type":"application/json"}})};');

function mockedModule(file,mocks){let text=source(file);for(const [name,body] of Object.entries(mocks)){text=text.replace(new RegExp(`from ["']${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`,'g'),`from ${JSON.stringify(url(body))}`);}return import(url(text));}

test('request parsing rejects malformed, array, wrong media type and oversized bodies',async()=>{
 const {readJson}=await guards;
 for(const [body,headers,status] of [['bad',{'Content-Type':'application/json'},400],['[]',{'Content-Type':'application/json'},400],['{}',{},415],['x'.repeat(17000),{'Content-Type':'application/json'},413]]){
  await assert.rejects(()=>readJson(new Request('https://example.com',{method:'POST',headers,body})),e=>e.status===status);
 }
 assert.deepEqual(await readJson(new Request('https://example.com',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"hello":1}'})),{hello:1});
});

test('same-origin checks and rate limits reject abuse',async()=>{
 const {checkOrigin,rateLimit}=await guards;
 assert.throws(()=>checkOrigin(new Request('https://example.com',{headers:{origin:'https://attacker.example'}})),e=>e.status===403);
 checkOrigin(new Request('https://example.com',{headers:{origin:'https://example.com'}}));
 const req=new Request('https://example.com',{headers:{'x-forwarded-for':'192.0.2.22'}});
 const key=crypto.randomUUID();await rateLimit(req,key,1);await assert.rejects(()=>rateLimit(req,key,1),e=>e.status===429);
});

test('concurrent requests cannot hold the same lock and locks release on failure',async()=>{
 const {withLock}=await guards;let release;const waiting=new Promise(r=>release=r);const key=crypto.randomUUID();
 const first=withLock(key,async()=>{await waiting;return 'done'});await new Promise(r=>setTimeout(r,5));
 await assert.rejects(()=>withLock(key,async()=>null),e=>e.status===409);release();assert.equal(await first,'done');
 await assert.rejects(()=>withLock(key,async()=>{throw new Error('failure')}));assert.equal(await withLock(key,async()=>42),42);
});

test('confirmation storage expiry and HTML/URL handling are safe',async()=>{
 const {readRegistration,escapeHtml,safeExternalUrl}=await display;let saved;
 const storage={getItem:()=>saved,removeItem:()=>{saved=null}};const now=Date.now();
 const data={name:'Rahul',email:'r@example.com',phone:'9876543210',timestamp:new Date(now).toISOString()};saved=JSON.stringify(data);assert.equal(readRegistration(storage,now).name,'Rahul');
 saved=JSON.stringify({...data,timestamp:'not-a-date'});assert.equal(readRegistration(storage,now),null);
 saved=JSON.stringify({...data,timestamp:new Date(now-3600001).toISOString()});assert.equal(readRegistration(storage,now),null);
 assert.equal(safeExternalUrl('javascript:alert(1)'),'');assert.equal(safeExternalUrl('https://example.com'),'https://example.com/');assert.equal(escapeHtml('<img src=x>'), '&lt;img src=x&gt;');
});

test('legacy payment endpoints reject writes while course pages are disabled',async()=>{
 for(const route of ['order','status','verify']){const {POST}=await mockedModule(`api/razorpay/${route}/route.js`,{'next/server':'export const NextResponse={json:(d,o)=>new Response(JSON.stringify(d),{status:o.status})}'});assert.equal((await POST()).status,410);}
});

test('cron and callbacks fail closed before touching providers',async()=>{
 const cron=await mockedModule('api/cron/route.js',{'next/server':'export const NextResponse={json:(d,o={})=>new Response(JSON.stringify(d),{status:o.status||200})}', '../../lib/googleSheet':'export async function readAllLeads(){throw new Error("must not read")}', '../../lib/reminders':'export const reminderTypes=[];export function deliverReminder(){}','../../lib/webinar':'export function getWebinarReminderTimes(){}','../../lib/waspakamify':'export function isWhatsAppSendingEnabled(){return true}'});
 assert.equal((await cron.GET(new Request('https://example.com/api/cron/'))).status,401);
 const callback=await mockedModule('api/qstash/route.js',{'next/server':'export const NextResponse={json:(d,o={})=>new Response(JSON.stringify(d),{status:o.status||200})}','../../lib/requestGuard':'export const readLimitedText=r=>r.text()', '../../lib/qstash':'export function verifyQstashRequest(){throw new Error("must not verify")}', '../../lib/googleSheet':'export function findRowByLeadId(){}','../../lib/reminders':'export const reminderTypes=[];export function deliverReminder(){}'});
 assert.equal((await callback.POST(new Request('https://example.com/api/qstash/',{method:'POST',body:'{}'}))).status,401);
});

test('QStash/cron retries skip a reminder already recorded as accepted',async()=>{
 globalThis.__reminderTest={calls:0,row:['','Rahul','','9876543210','','Sunday','29 Nov','11 AM',new Date(Date.now()+3600000).toISOString(),'no','no','no','no','no','lead-id','yes']};
 const mod=await mockedModule('lib/reminders.js',{'./googleSheet':'export const LEAD_STATUS_COLUMNS={"1day":"K"};export const readLead=async()=>globalThis.__reminderTest.row;export const readLeadStatus=(row)=>row[10];export const markCell=async()=>{globalThis.__reminderTest.row[10]="yes"}', './phone':'export const cleanPhone10=v=>v','./webinar':'export const getWebinarReminderTimes=()=>({"1day":Date.now()-1000})','./requestGuard':'export const withLock=async(k,fn)=>fn()','./waspakamify':'export const isWhatsAppSendingEnabled=()=>true;export async function send1DayReminder(){globalThis.__reminderTest.calls++}export const sendMorningReminder=send1DayReminder;export const send10MinReminder=send1DayReminder;export const sendLiveNow=send1DayReminder;'});
 assert.equal((await mod.deliverReminder(2,'1day','lead-id')).skipped,false);assert.equal((await mod.deliverReminder(2,'1day','lead-id')).skipped,true);assert.equal(globalThis.__reminderTest.calls,1);
});

test('saved registrations succeed even when notification scheduling is unavailable',async()=>{
 globalThis.__registrationTest={saved:0};
 const mod=await mockedModule('api/whatsapp/route.js',{
 'next/server':'export const NextResponse={json:(d,o={})=>new Response(JSON.stringify(d),{status:o.status||200})}',
 '../../lib/validate':'export const validateForm=b=>b',
 '../../lib/googleSheet':'export const LEAD_STATUS_COLUMNS={confirmation:"J"};export const findActiveLeadByContact=async()=>null;export const saveToSheet=async()=>{globalThis.__registrationTest.saved++;return{rowNumber:2}};export const markCell=async()=>{}',
 '../../lib/waspakamify':'export const isWhatsAppSendingEnabled=()=>true;export const sendConfirmation=async()=>{}',
 '../../lib/qstash':'export const getQstashTargetUrl=()=>"https://example.com";export const publishScheduled=async()=>{throw new Error("provider offline")};export const toEpochSeconds=n=>n/1000',
 '../../lib/webinar':'export const formatWebinarParts=()=>({webinarDay:"Sunday",webinarDate:"29 Nov",webinarTime:"11 AM"});export const getNextWebinarDate=()=>new Date(Date.now()+86400000);export const getUpcomingWebinarReminders=()=>[["live",Date.now()+86400000]];export const getWebinarReminderTimes=()=>({live:Date.now()+86400000})',
 '../../lib/requestGuard':'export const checkOrigin=()=>{};export const rateLimit=async()=>{};export const readJson=r=>r.json();export const withLock=async(k,fn)=>fn()'
 });
 const res=await mod.POST(new Request('https://example.com/api/whatsapp/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Rahul',email:'r@example.com',phone:'9876543210',whatsappConsent:true})}));assert.equal(res.status,200);assert.equal((await res.json()).success,true);assert.equal(globalThis.__registrationTest.saved,1);
});


test('escaped environment private keys normalize without changing real newlines', async()=>{
 const {normalizePrivateKey}=await import(url(source('lib/keys.js')));
 assert.equal(normalizePrivateKey('first'+String.fromCharCode(92)+'nsecond'),'first'+String.fromCharCode(10)+'second');
 assert.equal(normalizePrivateKey('first'+String.fromCharCode(10)+'second'),'first'+String.fromCharCode(10)+'second');
});

test('QStash verifies existing non-slash callback URLs after redirects',async()=>{
 const old={url:process.env.QSTASH_TARGET_URL,current:process.env.QSTASH_CURRENT_SIGNING_KEY,next:process.env.QSTASH_NEXT_SIGNING_KEY};
 process.env.QSTASH_TARGET_URL='https://example.com';process.env.QSTASH_CURRENT_SIGNING_KEY='test';process.env.QSTASH_NEXT_SIGNING_KEY='test';
 try {
  const mod=await mockedModule('lib/qstash.js',{'@upstash/qstash':'export class Receiver {async verify({url,body}){if(body!=="valid")return false;if(url==="https://example.com/api/qstash")return true;throw new Error("wrong subject")}}'});
  assert.equal(await mod.verifyQstashRequest({body:'valid',signature:'test',reqUrl:'https://example.com/api/qstash/'}),true);
  assert.equal(await mod.verifyQstashRequest({body:'invalid',signature:'test',reqUrl:'https://example.com/api/qstash/'}),false);
 }finally{for(const [key,value] of [['QSTASH_TARGET_URL',old.url],['QSTASH_CURRENT_SIGNING_KEY',old.current],['QSTASH_NEXT_SIGNING_KEY',old.next]])if(value===undefined)delete process.env[key];else process.env[key]=value;}
});
