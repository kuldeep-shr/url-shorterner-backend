import rateLimit from "express-rate-limit";
import { Request } from "express";

// Rate limiter: 10 requests per 1 minute per user/UUID/IP
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests. Please try again after a minute.",
  },
  keyGenerator: (req: Request): string => {
    // Authenticated user
    if (req.user?.id && !req.user?.isAnonymous) {
      return `user_${req.user.id}`;
    }

    // Anonymous user with UUID-based JWT
    if (req.user?.id && req.user?.isAnonymous) {
      return `anon_${req.user.id}`;
    }

    // Fallback: IP-based limiting
    return `ip_${req.ip}`;
  },
});
