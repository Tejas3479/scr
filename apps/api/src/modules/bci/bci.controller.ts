import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BciService, BciStatePayload } from './bci.service';

@Controller('bci')
export class BciController {
  constructor(private readonly bciService: BciService) {}

  @Post('state')
  @HttpCode(HttpStatus.CREATED)
  async recordState(@Body() payload: BciStatePayload) {
    return this.bciService.recordCognitiveState(payload);
  }

  @Get('history/:userId')
  async getHistory(
    @Param('userId') userId: string,
    @Query('limit') limit?: string
  ) {
    const limitVal = limit ? parseInt(limit, 10) : 50;
    return this.bciService.getCognitiveHistory(userId, limitVal);
  }
}
