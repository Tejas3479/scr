import { Module } from '@nestjs/common';
import { PasskeyController } from './passkey.controller';
import { PasskeyService } from './passkey.service';
import { TeeController } from './tee.controller';
import { TeeVerifierService } from './tee.service';
import { EnvelopeEncryptionService, RedlockService, SessionService } from './security.service';

@Module({
  controllers: [PasskeyController, TeeController],
  providers: [
    PasskeyService,
    TeeVerifierService,
    EnvelopeEncryptionService,
    RedlockService,
    SessionService,
  ],
  exports: [
    PasskeyService,
    TeeVerifierService,
    EnvelopeEncryptionService,
    RedlockService,
    SessionService,
  ],
})
export class AuthModule {}
