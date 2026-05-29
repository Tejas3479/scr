import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { QuantumModule } from './modules/quantum/quantum.module';
import { BciModule } from './modules/bci/bci.module';
import { DiseaseModule } from './modules/disease/disease.module';
import { FarmModule } from './modules/farm/farm.module';
import { SensorModule } from './modules/sensor/sensor.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    BlockchainModule,
    QuantumModule,
    BciModule,
    DiseaseModule,
    FarmModule,
    SensorModule,
  ],
})
export class AppModule {}
