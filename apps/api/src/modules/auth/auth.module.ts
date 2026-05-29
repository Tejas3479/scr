import { Module } from '@nestjs/common';
import { PasskeyController } from './passkey.controller';
import { PasskeyService } from './passkey.service';
import { TeeController } from './tee.controller';
import { TeeVerifierService } from './tee.service';

@Module({
  controllers: [PasskeyController, TeeController],
  providers: [PasskeyService, TeeVerifierService],
  exports: [PasskeyService, TeeVerifierService],
})
export class AuthModule {}
