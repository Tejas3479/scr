import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'OAuth 2.1 Bearer Token required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const publicKey = process.env.JWT_PUBLIC_KEY
      ? process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n')
      : 'simulated_public_key';

    // Validate signature
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    (req as any).user = decoded as jwt.JwtPayload;
    next();
  } catch {
    res.status(403).json({ error: 'Access Denied: Invalid or expired OAuth token' });
  }
}
