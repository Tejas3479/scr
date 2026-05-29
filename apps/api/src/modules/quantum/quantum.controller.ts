import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { QuantumService, CropOptimizationPayload, OptimizationResult } from './quantum.service';

@Controller('quantum')
export class QuantumController {
  constructor(private readonly quantumService: QuantumService) {}

  @Post('optimize')
  @HttpCode(HttpStatus.OK)
  async optimizeRotation(@Body() payload: CropOptimizationPayload): Promise<OptimizationResult> {
    return this.quantumService.solveCropRotation(payload);
  }
}
