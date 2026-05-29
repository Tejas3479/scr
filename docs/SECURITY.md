# 🔒 Security and Cryptography Specification — Eco Farm v4.0

Eco Farm v4.0 implements a multi-layered, zero-trust security framework tailored for solarpunk cognitive agricultural operations.

---

## 1. Zero-Trust Hardware Biometrics (WebAuthn)

- **Passkey Credentials:** Eliminates passwords. Biometric verification (face/fingerprint) is executed on the farmer's hardware authenticator.
- **Verification Flow:** The gateway verifies public key assertions and enrolls user-credentials securely via `@eco-farm/api` (`POST /auth/passkey/register-verify` and `POST /auth/passkey/login-verify`).

---

## 2. Post-Quantum Cryptography (PQC)

- **CRYSTALS-Dilithium:** Modern post-quantum signature schemes are simulated to secure sustainability certifications, blockchain ledgers, and device identities against quantum attacks.
- **Double-Envelope Key-Wrapping:** Symmetric credentials and LoRaWAN packets are encrypted using standard AES-GCM-256 wrapped within quantum-safe asymmetric envelopes.

---

## 3. Trusted Execution Environments (TEE)

- **Hardware Attestation:** Validates remote computing node integrity (Intel TDX / AWS Nitro) via the `TeeVerifierService` (`POST /auth/attest`).
- **Development Fallback:** Mocks TEE receipts gracefully for rapid sandbox verification without failing local CI/CD pipelines.

---

## 4. Distributed Session Quorum (Redlock)

- **Parallel Redis Ring:** Distributed quorums verify split-token session keys across a 5-node parallel Redis Master Quorum Ring.
- **SIGTERM Safety:** Ensures database and session connections are terminated gracefully during failovers.
