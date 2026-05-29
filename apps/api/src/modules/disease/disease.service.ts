import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DiseaseEventPayload {
  farmId: string;
  plotGeometry: any; // GeoJSON Point/Polygon mapping
  crisprResult: string; // pathogen name or negative
  imageUrl?: string;
  ragDiagnosis?: string;
  blockchainTxHash?: string;
}

@Injectable()
export class DiseaseService {
  private readonly logger = new Logger(DiseaseService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Logs a new crop disease outbreak verified by CRISPR or PCR tests.
   */
  async logDiseaseEvent(payload: DiseaseEventPayload): Promise<any> {
    this.logger.log(`🧬 Logging agricultural disease event for farm: ${payload.farmId}`);
    
    // Ensure the target Farm exists (create developer stub if not present)
    const farmExists = await this.prisma.farm.findUnique({
      where: { id: payload.farmId }
    });

    if (!farmExists) {
      // Ensure user exists first
      const defaultUser = 'default-user-id';
      const userExists = await this.prisma.user.findUnique({
        where: { id: defaultUser }
      });

      if (!userExists) {
        await this.prisma.user.create({
          data: {
            id: defaultUser,
            email: 'default-farmer@farmquest.nexus',
            name: 'Default Farming Pioneer'
          }
        });
      }

      await this.prisma.farm.create({
        data: {
          id: payload.farmId,
          name: 'Nexus Alpha Plot',
          userId: defaultUser
        }
      });
    }

    return this.prisma.diseaseEvent.create({
      data: {
        farmId: payload.farmId,
        plotGeometry: payload.plotGeometry,
        crisprResult: payload.crisprResult,
        imageUrl: payload.imageUrl || null,
        ragDiagnosis: payload.ragDiagnosis || null,
        blockchainTxHash: payload.blockchainTxHash || null,
      }
    });
  }

  /**
   * Resolves an active disease threat once treatment is deployed.
   */
  async resolveDiseaseEvent(eventId: string): Promise<any> {
    return this.prisma.diseaseEvent.update({
      where: { id: eventId },
      data: { resolvedAt: new Date() },
    });
  }

  /**
   * Retrieves active or historical infections.
   */
  async getDiseaseHistory(farmId: string): Promise<any> {
    return this.prisma.diseaseEvent.findMany({
      where: { farmId },
      orderBy: { confirmedAt: 'desc' },
    });
  }
}
