import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { FarmService, FarmCreationPayload } from './farm.service';

@Controller('farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFarm(@Body() payload: FarmCreationPayload): Promise<any> {
    return this.farmService.registerFarm(payload);
  }

  @Get('list/:userId')
  async listFarms(@Param('userId') userId: string): Promise<any> {
    return this.farmService.getFarmsByUser(userId);
  }
}
