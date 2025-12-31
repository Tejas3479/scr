#!/usr/bin/env node
const fetch = require('node-fetch');
const CF_TOKEN = process.env.CF_API_TOKEN;
const ZONE_ID = process.env.CF_ZONE_ID;

if (!CF_TOKEN || !ZONE_ID) {
  console.error('Set CF_API_TOKEN and CF_ZONE_ID environment variables');
  process.exit(1);
}

const headers = {
  'Authorization': `Bearer ${CF_TOKEN}`,
  'Content-Type': 'application/json'
};

async function createRateLimit() {
  const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/rate_limits`;
  const body = {
    "disabled": false,
    "description": "Rate limit for API endpoints",
    "match": {
      "request": {
        "methods": ["GET","POST","PUT","DELETE","PATCH"],
        "schemes": ["HTTP","HTTPS"],
        "url": { "operator": "matches", "value": "*example.com/api/*" }
      }
    },
    "threshold": 100,
    "period": 60,
    "action": { "mode": "throttle", "timeout": 60 }
  };
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  return res.json();
}

async function createFirewallRule(ipList) {
  const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/firewall/rules`;
  const rules = [];
  if (ipList && ipList.length) {
    ipList.forEach(ip => {
      rules.push({
        "action": "block",
        "priority": 1000,
        "filter": { "expression": `ip.src eq ${ip}`, "paused": false },
        "description": `Block IP ${ip}`
      });
    });
  }
  // Add a JS challenge for suspicious requests to /api/*
  rules.push({
    action: 'challenge',
    priority: 1100,
    filter: { expression: `http.request.uri.path contains "/api/"`, paused: false },
    description: 'Challenge requests to /api/ to mitigate bots'
  });

  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(rules) });
  return res.json();
}

async function enableWAF() {
  const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/settings/waf`; 
  const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify({ value: 'on' }) });
  return res.json();
}

(async () => {
  try {
    console.log('Enabling WAF...');
    const wafRes = await enableWAF();
    console.log('WAF response', JSON.stringify(wafRes, null, 2));

    console.log('Creating rate limit (adjust domain in script)...');
    const rl = await createRateLimit();
    console.log('Rate limit response', JSON.stringify(rl, null, 2));

    const raw = process.env.IP_BLACKLIST || '';
    const ipList = raw.split(',').map(s=>s.trim()).filter(Boolean);
    if (ipList.length) {
      console.log('Creating firewall rules for IP blacklist...');
    }
    const fw = await createFirewallRule(ipList);
    console.log('Firewall rules response', JSON.stringify(fw, null, 2));

    console.log('Cloudflare configuration completed.');
  } catch (err) {
    console.error('Failed to configure Cloudflare', err.message || err);
    process.exit(2);
  }
})();
