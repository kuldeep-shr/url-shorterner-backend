import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redisClient";
import httpstatuscodes from "http-status-codes";

const WINDOW_SECONDS = 60;

/**
 @authenticated allow 10 requests in 1 minute of interval
 @anonymous allow 5 requests in 1 minute of interval
 */
const RATE_LIMITS = {
  authenticated: 10,
  anonymous: 5,
};

export const customRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = (req as any).user?.id;
    const identifier = userId ? `user:${userId}` : `ip:${req.ip}`;
    console.log("Rate limiter identifier:", identifier);

    const key = `rate_limit:${identifier}`;

    const maxRequests = userId
      ? RATE_LIMITS.authenticated
      : RATE_LIMITS.anonymous;

    const current = await redisClient.incr(key);
    console.log("Rate limiter current count:", current);

    if (current === 1) {
      await redisClient.expire(key, WINDOW_SECONDS);
    }

    if (current > maxRequests) {
      return res.status(httpstatuscodes.TOO_MANY_REQUESTS).json({
        success: false,
        error: {
          message: `⏳ Rate limit exceeded. You are allowed ${maxRequests} requests per ${WINDOW_SECONDS} seconds.`,
        },
      });
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    return res.status(httpstatuscodes.BAD_GATEWAY).json({
      success: false,
      error: {
        message: "Internal Server Error",
      },
    });
  }
};
