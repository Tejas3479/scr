#!/usr/bin/env bash
set -euo pipefail
if [ -z "${CF_API_TOKEN:-}" ] || [ -z "${CF_ZONE_ID:-}" ]; then
  echo "Set CF_API_TOKEN and CF_ZONE_ID environment variables"
  exit 1
fi

AUTH_HEADER="Authorization: Bearer ${CF_API_TOKEN}"
CONTENT_HEADER="Content-Type: application/json"

# enable WAF
curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/settings/waf" \
  -H "$AUTH_HEADER" -H "$CONTENT_HEADER" \
  --data '{"value":"on"}' | jq '.'

# create rate limit (adjust domain/path)
cat <<'JSON' > /tmp/rl.json
{
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
}
JSON
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/rate_limits" \
  -H "$AUTH_HEADER" -H "$CONTENT_HEADER" --data @/tmp/rl.json | jq '.'

# firewall rules: IP blacklist
if [ -n "${IP_BLACKLIST:-}" ]; then
  IFS=',' read -ra IPS <<< "$IP_BLACKLIST"
  RULES="[]"
  for ip in "${IPS[@]}"; do
    ip_trim=$(echo "$ip" | xargs)
    if [ -n "$ip_trim" ]; then
      RULES=$(jq --arg ip "$ip_trim" '. + [{action:"block", priority:1000, filter:{expression:("ip.src eq "+$ip), paused:false}, description:("Block IP "+$ip)}]' <<< "$RULES")
    fi
  done
  RULES=$(jq '. + [{action:"challenge", priority:1100, filter:{expression:"http.request.uri.path contains \"/api/\"", paused:false}, description:"Challenge requests to /api/"}]' <<< "$RULES")
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/firewall/rules" \
    -H "$AUTH_HEADER" -H "$CONTENT_HEADER" --data "$RULES" | jq '.'
fi
