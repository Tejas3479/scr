import { Controller, Post, Get, Body, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { DiseaseService, DiseaseEventPayload } from './disease.service';

@Controller('disease')
export class DiseaseController {
  constructor(private readonly diseaseService: DiseaseService) {}

  @Post('event')
  @HttpCode(HttpStatus.CREATED)
  async recordEvent(@Body() payload: DiseaseEventPayload): Promise<any> {
    return this.diseaseService.logDiseaseEvent(payload);
  }

  @Put('resolve/:id')
  async resolveEvent(@Param('id') id: string): Promise<any> {
    return this.diseaseService.resolveDiseaseEvent(id);
  }

  @Get('history/:farmId')
  async getHistory(@Param('farmId') farmId: string): Promise<any> {
    return this.diseaseService.getDiseaseHistory(farmId);
  }
}
