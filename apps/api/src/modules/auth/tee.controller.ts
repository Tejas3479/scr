import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { TeeVerifierService } from './tee.service';

@Controller('auth/attest')
export class TeeController {
  constructor(private readonly teeVerifier: TeeVerifierService) {}

  @Post()
  async attest(@Body() body: { docHex: string; dataHex: string }) {
    const doc = Buffer.from(body.docHex, 'hex');
    const data = Buffer.from(body.dataHex, 'hex');
    const isValid = await this.teeVerifier.verifyAttestation(doc, data);
    
    if (!isValid) throw new UnauthorizedException('TEE attestation failed');
    return {
      success: true,
      timestamp: new Date(),
      attestationReceipt: 'Intel_TDX_Receipt_Verified_0x' + body.docHex.slice(0, 8)
    };
  }
}
