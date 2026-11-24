const fs=require('node:fs'),path=require('node:path');
const argv=new Set(process.argv.slice(2));
try { process.loadEnvFile('.env.local'); } catch { /* Read deployment environment if no local file exists. */ }
const required=['NEXT_PUBLIC_SITE_URL','GOOGLE_SHEET_ID','GOOGLE_CLIENT_EMAIL','GOOGLE_PRIVATE_KEY','CRON_SECRET'];
if(process.env.WHATSAPP_SENDING_ENABLED!=='false') required.push('WASPAKAMIFY_BASE_URL','WASPAKAMIFY_API_KEY','WASPAKAMIFY_CAMPAIGN_CONFIRM','WASPAKAMIFY_CAMPAIGN_1DAY','WASPAKAMIFY_CAMPAIGN_MORNING','WASPAKAMIFY_CAMPAIGN_10MIN','WASPAKAMIFY_CAMPAIGN_LIVE','WEBINAR_EVENT_NAME','WEBINAR_LINK','WHATSAPP_COMMUNITY_URL','QSTASH_TOKEN','QSTASH_CURRENT_SIGNING_KEY','QSTASH_NEXT_SIGNING_KEY');
if(argv.has('--serverless')||process.env.VERCEL||process.env.REQUIRE_SHARED_STATE==='true') required.push('UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN');
const issues=required.filter(key=>!process.env[key]).map(key=>`Missing ${key}`);
for(const key of ['NEXT_PUBLIC_SITE_URL','QSTASH_TARGET_URL','WASPAKAMIFY_BASE_URL','UPSTASH_REDIS_REST_URL','WEBINAR_LINK','WHATSAPP_COMMUNITY_URL']) {
 if(process.env[key]) { try { const u=new URL(process.env[key]); if(u.protocol!=='https:')issues.push(`${key} must use HTTPS in production`); }catch{issues.push(`${key} must be a valid absolute URL`);} }
}
if(process.env.CRON_SECRET && process.env.CRON_SECRET.length<32) issues.push('Use a CRON_SECRET with at least 32 random characters');
for(const asset of ['logo.png','profile.png','success-page.mp4','confirmation-template.mp4']) if(!fs.existsSync(path.join('public',asset)))issues.push(`Missing public/${asset}`);
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}else console.log('Production configuration checks passed. Perform a test registration and confirm provider delivery before launch.');
