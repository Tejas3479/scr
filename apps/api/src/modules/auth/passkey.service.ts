import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PasskeyService {
  private redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  constructor(private readonly prisma: PrismaService) {}

  async generateRegistrationOptions(user: { id: string; email: string }) {
    const options = await generateRegistrationOptions({
      rpName: 'Eco Farm',
      rpID: process.env.RP_ID || 'localhost',
      userID: user.id,
      userName: user.email,
      authenticatorSelection: { userVerification: 'required' },
    });
    // Store registration challenge in Redis with 5 min expiration
    await this.redis.setex(`challenge:${user.id}`, 300, options.challenge);
    return options;
  }

  async verifyRegistration(userId: string, body: any) {
    const expectedChallenge = await this.redis.get(`challenge:${userId}`);
    if (!expectedChallenge) {
      throw new UnauthorizedException('Registration challenge expired or missing');
    }

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: `https://${process.env.RP_ID || 'localhost:3007'}`,
      expectedRPID: process.env.RP_ID || 'localhost',
    });

    if (!verification.verified || !verification.registrationInfo) {
      throw new UnauthorizedException('Biometric validation failed');
    }

    const { credentialID, credentialPublicKey } = verification.registrationInfo;

    // Persist to user table in PostgreSQL
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passkeyCredentialId: Buffer.from(credentialID),
        passkeyPublicKey: Buffer.from(credentialPublicKey),
      },
    });

    await this.redis.del(`challenge:${userId}`);
    return verification.registrationInfo;
  }

  async generateAuthenticationOptions(userId: string) {
    const options = await generateAuthenticationOptions({
      rpID: process.env.RP_ID || 'localhost',
      userVerification: 'required',
    });
    // Store auth challenge in Redis
    await this.redis.setex(`auth_challenge:${userId}`, 300, options.challenge);
    return options;
  }

  async verifyAuthentication(userId: string, body: any, userPublicKey?: Buffer, credentialId?: Buffer) {
    const expectedChallenge = await this.redis.get(`auth_challenge:${userId}`);
    if (!expectedChallenge) {
      throw new UnauthorizedException('Authentication challenge expired or missing');
    }

    let pubKey = userPublicKey;
    let credId = credentialId;

    if (!pubKey || !credId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user || !user.passkeyPublicKey || !user.passkeyCredentialId) {
        throw new UnauthorizedException('No registered passkey found for this user');
      }
      pubKey = user.passkeyPublicKey;
      credId = user.passkeyCredentialId;
    }

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: `https://${process.env.RP_ID || 'localhost:3007'}`,
      expectedRPID: process.env.RP_ID || 'localhost',
      authenticator: {
        credentialID: credId,
        credentialPublicKey: pubKey,
        counter: 0,
      },
    });

    if (!verification.verified) {
      throw new UnauthorizedException('Biometric authentication failed');
    }

    await this.redis.del(`auth_challenge:${userId}`);
    return verification.authenticationInfo;
  }
}
