import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface BciStatePayload {
  userId: string;
  attentionScore: number;
  stressLevel: number;
  cognitiveLoad: number;
}

@Injectable()
export class BciService {
  private readonly logger = new Logger(BciService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persists live operator cognitive states directly into the database.
   */
  async recordCognitiveState(payload: BciStatePayload) {
    this.logger.log(`🧠 Ingesting neural telemetry for user: ${payload.userId}`);
    
    // Ensure user exists (auto-create developer stub if not present)
    const userExists = await this.prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!userExists) {
      await this.prisma.user.create({
        data: {
          id: payload.userId,
          email: `${payload.userId}@farmquest.nexus`,
          name: 'Expert Bio-Farmer'
        }
      });
    }

    return this.prisma.bCICognitiveState.create({
      data: {
        userId: payload.userId,
        attentionScore: payload.attentionScore,
        stressLevel: payload.stressLevel,
        cognitiveLoad: payload.cognitiveLoad,
      }
    });
  }

  /**
   * Fetches historical brainwave and stress logs for biometric analysis.
   */
  async getCognitiveHistory(userId: string, limit = 50) {
    return this.prisma.bCICognitiveState.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}
