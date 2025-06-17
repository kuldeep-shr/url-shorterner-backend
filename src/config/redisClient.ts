import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.log("process.env.REDIS_URL", process.env.REDIS_URL);
  console.error("❌ Redis Client Error:", err);
});

export const initRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis connected");
    }
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
  }
};

export const getCache = async (key: string): Promise<any | null> => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("🔍 Redis GET error:", error);
    return null;
  }
};

export const setCache = async (
  key: string,
  value: any,
  ttlSeconds = 60
): Promise<void> => {
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error("❌ Redis SET error:", error);
  }
};

export default redisClient;
