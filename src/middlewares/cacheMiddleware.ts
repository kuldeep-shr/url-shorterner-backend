import { Request, Response, NextFunction } from "express";
import { getCache, setCache } from "../config/redisClient";
import apiResponse from "../utilities/apiResponse";
import httpStatusCodes from "http-status-codes";
import crypto from "crypto";

const generateCacheKey = (req: Request): string => {
  const base = {
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  };
  const rawKey = JSON.stringify(base);
  const hash = crypto.createHash("md5").update(rawKey).digest("hex");
  return `memo:${hash}`;
};

export const redisMemoMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // Only memoize GET requests
  if (req.method !== "GET") return next();

  const key = generateCacheKey(req);

  try {
    const cached = await getCache(key);
    if (cached) {
      return apiResponse.result(res, cached.data, httpStatusCodes.OK);
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      // Set cache only if response is successful
      if (res.statusCode === 200) {
        setCache(key, body, 60);
      }
      return originalJson(body);
    };
    next();
  } catch (error) {
    return apiResponse.error(
      res,
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      "Memoization failed"
    );
  }
};
