param()
if (-not $env:CF_API_TOKEN -or -not $env:CF_ZONE_ID) {
  Write-Error "Set CF_API_TOKEN and CF_ZONE_ID environment variables"
  exit 1
}

$headers = @{
  Authorization = "Bearer $env:CF_API_TOKEN"
  'Content-Type' = 'application/json'
}

# Example: enable WAF
$wafUrl = "https://api.cloudflare.com/client/v4/zones/$($env:CF_ZONE_ID)/settings/waf"
$response = Invoke-RestMethod -Uri $wafUrl -Method Patch -Headers $headers -Body (@{ value = 'on' } | ConvertTo-Json)
Write-Output "WAF: $($response.success)"

# Example: create rate limit - adjust domain/path as needed
$rlUrl = "https://api.cloudflare.com/client/v4/zones/$($env:CF_ZONE_ID)/rate_limits"
$rlBody = @{
  disabled = $false
  description = 'Rate limit for API endpoints'
  match = @{ request = @{ methods = @('GET','POST','PUT','DELETE','PATCH'); schemes = @('HTTP','HTTPS'); url = @{ operator = 'matches'; value = '*example.com/api/*' } } }
  threshold = 100
  period = 60
  action = @{ mode = 'throttle'; timeout = 60 }
} | ConvertTo-Json -Depth 6
$rlResp = Invoke-RestMethod -Uri $rlUrl -Method Post -Headers $headers -Body $rlBody
Write-Output "Rate limit created: $($rlResp.success)"

# Firewall rules for IP blacklist
$ipRaw = $env:IP_BLACKLIST
if ($ipRaw) {
  $ips = $ipRaw.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
  $fwUrl = "https://api.cloudflare.com/client/v4/zones/$($env:CF_ZONE_ID)/firewall/rules"
  $rules = @()
  foreach ($ip in $ips) {
    $rules += @{ action = 'block'; priority = 1000; filter = @{ expression = "ip.src eq $ip"; paused = $false }; description = "Block IP $ip" }
  }
  $rules += @{ action = 'challenge'; priority = 1100; filter = @{ expression = 'http.request.uri.path contains "/api/"'; paused = $false }; description = 'Challenge requests to /api/' }
  $fwResp = Invoke-RestMethod -Uri $fwUrl -Method Post -Headers $headers -Body ($rules | ConvertTo-Json)
  Write-Output "Firewall rules created: $($fwResp.success)"
}
