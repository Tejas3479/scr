// Augment Express Request to carry JWT payload after auth middleware
declare namespace Express {
  interface Request {
    user?: import('jsonwebtoken').JwtPayload | string;
  }
}
