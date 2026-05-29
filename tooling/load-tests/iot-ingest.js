import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 50, // 50 virtual users simulating concurrent sensor nodes
  duration: '10s',
};

export default function () {
  const url = 'http://localhost:3000/api/v1/sensors/leaf-electrophysiology';
  
  const payload = JSON.stringify({
    probe_id: 'leaf_probe_01',
    voltage_uv: Math.random() * 100, // microvolts leaf stress
    timestamp: new Date().toISOString()
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock_auth_token'
    },
  };

  const res = http.post(url, payload, params);
  
  check(res, {
    'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'transaction time < 100ms': (r) => r.timings.duration < 100,
  });
  
  sleep(0.1);
}
