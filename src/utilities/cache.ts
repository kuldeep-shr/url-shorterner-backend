import Redis from "ioredis";

const redisClient = new Redis();

export const getCache = async (key: string): Promise<any | null> => {
  const data: any = await redisClient.get(key);
  console.log("da", data);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (
  key: string,
  value: any,
  ttlSeconds = 60
): Promise<void> => {
  await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
};
