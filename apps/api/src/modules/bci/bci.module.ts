import { Module } from '@nestjs/common';
import { BciService } from './bci.service';
import { BciController } from './bci.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BciController],
  providers: [BciService],
  exports: [BciService],
})
export class BciModule {}
