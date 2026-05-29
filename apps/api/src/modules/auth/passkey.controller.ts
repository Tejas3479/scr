import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { PasskeyService } from './passkey.service';

@Controller('auth/passkey')
export class PasskeyController {
  constructor(private readonly passkeyService: PasskeyService) {}

  @Post('register-options')
  async registerOptions(@Body() body: { id: string; email: string }) {
    return this.passkeyService.generateRegistrationOptions(body);
  }

  @Post('register-verify')
  async registerVerify(@Body() body: { userId: string; attestation: any }) {
    return this.passkeyService.verifyRegistration(body.userId, body.attestation);
  }

  @Post('login-options')
  async loginOptions(@Body() body: { userId: string }) {
    return this.passkeyService.generateAuthenticationOptions(body.userId);
  }

  @Post('login-verify')
  async loginVerify(
    @Body() body: { userId: string; assertion: any; publicKeyHex: string; credentialIdHex: string }
  ) {
    const pubKey = Buffer.from(body.publicKeyHex, 'hex');
    const credId = Buffer.from(body.credentialIdHex, 'hex');
    return this.passkeyService.verifyAuthentication(body.userId, body.assertion, pubKey, credId);
  }
}
