import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SensorReadingPayload {
  deviceId: string;
  metric: string;
  value: number;
}

@Injectable()
export class SensorService {
  private readonly logger = new Logger(SensorService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new sensor node to an active farm plot.
   */
  async registerDevice(devEUI: string, type: string, farmId: string): Promise<any> {
    this.logger.log(`📡 Provisioning LoRaWAN Sensor node devEUI: ${devEUI}`);
    return this.prisma.sensorDevice.upsert({
      where: { devEUI },
      update: { type, farmId },
      create: {
        devEUI,
        type,
        farmId,
      }
    });
  }

  /**
   * Persists a dynamic sensor metric reading into TimescaleDB-inspired composite keys.
   */
  async recordReading(payload: SensorReadingPayload): Promise<any> {
    this.logger.log(`📡 Ingesting sensor reading [${payload.metric}]: ${payload.value} for device: ${payload.deviceId}`);
    
    // Save to time-series readings table
    const reading = await this.prisma.sensorReading.create({
      data: {
        time: new Date(),
        deviceId: payload.deviceId,
        metric: payload.metric,
        value: payload.value,
      }
    });

    // Update last reading cache in SensorDevice table (non-blocking)
    try {
      await this.prisma.sensorDevice.update({
        where: { id: payload.deviceId },
        data: {
          lastReading: {
            metric: payload.metric,
            value: payload.value,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch {
      // Stub device auto-creation if it was not registered prior
      await this.prisma.sensorDevice.create({
        data: {
          id: payload.deviceId,
          devEUI: `DEV-EUI-${payload.deviceId}`,
          type: 'soil_moisture',
          farmId: 'default-farm-id',
          lastReading: {
            metric: payload.metric,
            value: payload.value,
            timestamp: new Date().toISOString()
          }
        }
      });
    }

    return reading;
  }

  /**
   * Fetches latest readings cache for the spatial twin overlays.
   */
  async getLatestReadings(deviceId: string, limit = 20): Promise<any> {
    return this.prisma.sensorReading.findMany({
      where: { deviceId },
      orderBy: { time: 'desc' },
      take: limit,
    });
  }
}
