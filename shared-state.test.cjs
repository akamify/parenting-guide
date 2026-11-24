const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const url=s=>`data:text/javascript;base64,${Buffer.from(s).toString('base64')}`;
const guards=import(url(fs.readFileSync(`${__dirname}/src/app/lib/requestGuard.js`,'utf8')));

test('Redis-backed locks use NX/expiry and release only their own token',async()=>{
 const {withLock,rateLimit}=await guards;
 const previous={url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN,fetch:global.fetch};const commands=[];
 process.env.UPSTASH_REDIS_REST_URL='https://redis.example.com';process.env.UPSTASH_REDIS_REST_TOKEN='test-token';
 global.fetch=async(_url,options)=>{const command=JSON.parse(options.body);commands.push(command);return new Response(JSON.stringify({result:command[0]==='SET'?'OK':1}),{status:200})};
 try {
  assert.equal(await withLock('same-lead',async()=>42),42);
  assert.deepEqual(commands[0].slice(3),['NX','EX',120]);assert.equal(commands[1][0],'EVAL');assert.ok(commands[1][1].includes("ARGV[1]"));assert.equal(commands[1].at(-1),commands[0][2]);
  await rateLimit(new Request('https://example.com'),crypto.randomUUID(),1);
 }finally{global.fetch=previous.fetch;for(const [key,value] of [['UPSTASH_REDIS_REST_URL',previous.url],['UPSTASH_REDIS_REST_TOKEN',previous.token]]){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
});
