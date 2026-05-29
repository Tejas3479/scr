import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface FarmCreationPayload {
  name: string;
  boundary: any; // GeoJSON boundary polygon
  userId: string;
}

@Injectable()
export class FarmService {
  private readonly logger = new Logger(FarmService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new farm field mapping with GIS spatial boundaries.
   */
  async registerFarm(payload: FarmCreationPayload): Promise<any> {
    this.logger.log(`🌾 Registering new farm sector boundary: ${payload.name}`);
    
    // Ensure the target User exists (create developer stub if not present)
    const userExists = await this.prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!userExists) {
      await this.prisma.user.create({
        data: {
          id: payload.userId,
          email: `${payload.userId}@farmquest.nexus`,
          name: 'Farming Pioneer'
        }
      });
    }

    return this.prisma.farm.create({
      data: {
        name: payload.name,
        boundary: payload.boundary,
        userId: payload.userId,
      }
    });
  }

  /**
   * Fetches all registered farm boundaries for the WebGL/WebGPU spatial canvas.
   */
  async getFarmsByUser(userId: string): Promise<any> {
    return this.prisma.farm.findMany({
      where: { userId },
      include: {
        diseaseEvents: true,
        carbonCredits: true
      }
    });
  }
}
