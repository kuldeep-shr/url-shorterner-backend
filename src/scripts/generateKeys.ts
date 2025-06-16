import { AppDataSource } from "../../ormconfig";
import { KGSKey } from "../../entities/url/Kgs";

const generateRandomCode = (length = 7): string => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const insertUniqueCodes = async (count: number) => {
  const repo = AppDataSource.getRepository(KGSKey);
  const existing = new Set((await repo.find()).map((k) => k.short_code));

  const newCodes: KGSKey[] = [];

  while (newCodes.length < count) {
    const code = generateRandomCode();
    if (!existing.has(code)) {
      const key = new KGSKey();
      key.short_code = code;
      newCodes.push(key);
      existing.add(code);
    }
  }

  await repo.save(newCodes);
  console.log(`Inserted ${newCodes.length} short codes.`);
};

AppDataSource.initialize()
  .then(() => insertUniqueCodes(10000))
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
