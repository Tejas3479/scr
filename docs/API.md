# 🔌 API Specification & Endpoint Schema — Eco Farm v4.0

This document outlines the API endpoints, request schemas, and response formats of the **Eco Farm v4.0** cognitive gateway and subservices.

---

## 🔑 Authentication

All secure endpoints utilize passkeys or JWT tokens. Passkey biometric validation routes:

### 1. Register Options
`POST /auth/passkey/register-options`
```json
{
  "id": "cuid_user_123",
  "email": "farmer@solarpunk.org"
}
```

### 2. Verify Registration
`POST /auth/passkey/register-verify`
```json
{
  "userId": "cuid_user_123",
  "attestation": { ... }
}
```

### 3. TEE Attestation Check
`POST /auth/attest`
```json
{
  "docHex": "abcdef0123456789...",
  "dataHex": "1122334455667788..."
}
```

---

## 🧠 Brain-Computer Interface (BCI)

### 1. Record Cognitive State
`POST /bci/state`
```json
{
  "userId": "cuid_user_123",
  "attentionScore": 0.85,
  "stressLevel": 0.21,
  "cognitiveLoad": 0.45
}
```

### 2. Retrieve History
`GET /bci/history/:userId?limit=50`

---

## 📡 Sensor & Telemetry

### 1. Register LoRaWAN IoT Device
`POST /sensors/register`
```json
{
  "devEUI": "00250C0000010203",
  "type": "soil_moisture",
  "farmId": "cuid_farm_abc"
}
```

### 2. Record Sensor Telemetry
`POST /sensors/reading`
```json
{
  "time": "2026-05-30T00:00:00Z",
  "deviceId": "cuid_device_xyz",
  "metric": "moisture_percentage",
  "value": 45.8
}
```

---

## 🌾 Farm Management & Boundaries

### 1. Register Farm Row
`POST /farms`
```json
{
  "name": "North Field CRISPR Corn",
  "boundary": {
    "type": "Polygon",
    "coordinates": [[[72.87, 19.07], [72.88, 19.07], [72.88, 19.08], [72.87, 19.08], [72.87, 19.07]]]
  },
  "userId": "cuid_user_123"
}
```

---

## 🔬 Bioinformatics & Disease Events

### 1. Log CRISPR Pathogen Event
`POST /disease/event`
```json
{
  "farmId": "cuid_farm_abc",
  "plotGeometry": { "type": "Point", "coordinates": [72.877, 19.076] },
  "crisprResult": "Rice Blast Fungus (Magnaporthe oryzae)",
  "imageUrl": "https://ipfs.io/ipfs/QmXyZ..."
}
```

### 2. Align Raw Field PCR Probes (FastAPI - Port 3008)
`POST /api/bioinformatics/align-pcr`
```json
{
  "probe_id": "probe_rc_01",
  "sequence_read": "ATGCGTCGATTCGATCGATTCGAT",
  "fluorescence_intensity": 0.82
}
```
**Response (Pathogen Detected):**
```json
{
  "pathogen_detected": "Rice Blast Fungus (Magnaporthe oryzae)",
  "scientific_name": "Rice Blast Fungus (Magnaporthe oryzae)",
  "alignment_score": 100.0,
  "severity_level": "critical",
  "recommended_treatment": "Deploy Bacillus thuringiensis endophyte strain BT-92 organic spray. [Trace: ||||||||||||||||||||||||]",
  "cas_collateral_cleavage_active": true
}
```
