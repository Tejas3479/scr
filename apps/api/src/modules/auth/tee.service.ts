import { Injectable } from '@nestjs/common';

export interface ITeeVerifier {
  verifyAttestation(doc: Buffer, rawData: Buffer): Promise<boolean>;
}

@Injectable()
export class TeeVerifierService implements ITeeVerifier {
  async verifyAttestation(doc: Buffer, rawData: Buffer): Promise<boolean> {
    try {
      // Local development or simulated TEE mode
      if (process.env.NODE_ENV !== 'production') {
        console.log('🛡️ TEE SIMULATION ACTIVE: Bypassing Intel TDX hardware challenge.');
        return true;
      }
      
      // Staging and Production implementation using AWS Nitro attestation verifier
      const { verifyAttestation } = require('@aws/aws-nitro-attestation');
      return await verifyAttestation(doc, rawData);
    } catch (err) {
      console.warn('TEE attestation validation failure:', err.message);
      return false;
    }
  }
}
