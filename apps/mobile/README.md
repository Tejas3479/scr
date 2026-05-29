# 📱 Mobile Client (React Native HUD) — Eco Farm v4.0

This workspace contains the React Native mobile HUD client that acts as the physical field assistant for farmers operating the Solarpunk Cognitive Agriculture OS.

---

## ⚡ Key Features

1. **BCI Focus HUD:** Floating telemetry indicators tracking focus and cognitive load.
2. **Offline LIF-SNN Alerts:** Monitors soil moisture and foliar bio-telemetry, showing offline buffering alerts when LoRaWAN backhaul is interrupted.
3. **Biometric Security:** Enrolls WebAuthn passkeys via the NestJS API gateway.
4. **Interactive AR Diagnostics:** Superimposes yield projections and PCR alignment traces onto active crop rows.

---

## 🛠️ Onboarding & Running

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```
2. **Run iOS / Android Hub:**
   ```bash
   pnpm --filter @eco-farm/mobile run ios
   # or
   pnpm --filter @eco-farm/mobile run android
   ```
