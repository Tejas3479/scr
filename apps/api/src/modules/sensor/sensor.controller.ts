import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SensorService, SensorReadingPayload } from './sensor.service';

@Controller('sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post('register')
  async registerDevice(
    @Body() body: { devEUI: string; type: string; farmId: string }
  ): Promise<any> {
    return this.sensorService.registerDevice(body.devEUI, body.type, body.farmId);
  }

  @Post('reading')
  @HttpCode(HttpStatus.CREATED)
  async recordReading(@Body() payload: SensorReadingPayload): Promise<any> {
    return this.sensorService.recordReading(payload);
  }

  @Get(':deviceId')
  async getReadings(
    @Param('deviceId') deviceId: string,
    @Query('limit') limit?: string
  ): Promise<any> {
    const limitVal = limit ? parseInt(limit, 10) : 20;
    return this.sensorService.getLatestReadings(deviceId, limitVal);
  }
}
