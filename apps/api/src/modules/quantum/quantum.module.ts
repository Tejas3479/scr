import { Module } from '@nestjs/common';
import { QuantumService } from './quantum.service';
import { QuantumController } from './quantum.controller';

@Module({
  controllers: [QuantumController],
  providers: [QuantumService],
  exports: [QuantumService],
})
export class QuantumModule {}
