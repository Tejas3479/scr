import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { QuantumModule } from './modules/quantum/quantum.module';

@Module({
  imports: [AuthModule, PrismaModule, BlockchainModule, QuantumModule],
})
export class AppModule {}
