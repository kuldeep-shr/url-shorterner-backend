import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error", err);
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
