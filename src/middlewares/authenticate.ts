import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET: string = String(process.env.JWT_SECRET);
const JWT_EXPIRES_IN = "1d";

declare module "express" {
  interface Request {
    user?: any;
  }
}

/**
 * Generate a signed JWT token with payload
 *
 * @param payload - The data to encode inside the token
 * @returns JWT token string
 */
export function createToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify a JWT token and return the decoded payload
 *
 * @param token - JWT token string
 * @returns Decoded payload if valid, otherwise throws error
 */
export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}

/**
 * Express middleware to verify JWT token and attach user to request and also for anonymous user too
 *
 * Usage: app.use(authenticateToken)
 */

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const authHeader = req.headers.authorization;

  // Case1: Authenticated flow (token provided)
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      return next();
    } catch (err) {
      // Token exists but invalid → show error
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid or expired token. Please login again.",
      });
    }
  }

  // Case2: Anonymous flow (no token)
  const anonymousPayload = {
    id: `anon_${uuidv4()}`,
    type: "anonymous",
    isAnonymous: true,
  };

  const anonToken = createToken(anonymousPayload);
  req.user = anonymousPayload;

  res.setHeader("X-Anonymous-Token", anonToken);

  return next();
}
