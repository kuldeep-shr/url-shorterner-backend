import { AppDataSource } from "../../ormconfig";
import { ShortUrl } from "../../entities/url/ShortUrl";
import { KGSKey } from "../../entities/url/Kgs";
import { User } from "../../entities/user/User";
// import { generateShortCode } from "../utilities/encryptionUtils";
import { KGSService } from "./kgs.service";

interface ShortenInput {
  original_url: string;
  custom_alias?: string;
  expires_in_days?: number;
  user_id: string;
}

//creating short url using long url
export const shortenUrl = async ({
  original_url,
  custom_alias,
  expires_in_days,
  user_id,
}: ShortenInput) => {
  const urlRepo = AppDataSource.getRepository(ShortUrl);
  const userRepo = AppDataSource.getRepository(User);
  // const kgsRepo = AppDataSource.getRepository(KGSKey);

  const user = await userRepo.findOneBy({ id: user_id });
  if (!user) throw new Error("User not found");

  // Step 1: Check if URL already shortened by this user
  const existingUrl = await urlRepo.findOneBy({
    original_url,
    user: { id: user_id },
  });
  if (existingUrl) {
    return {
      isNew: false,
      message: "Short URL already exists for this long URL",
      short_code: existingUrl.short_code,
      short_url: `http://localhost:8000/${existingUrl.short_code}`,
    };
  }

  // Step 2: Use custom alias or get KGS key
  const short_code = custom_alias?.trim() || (await getAvailableKeyFromKGS());
  if (!short_code) throw new Error("Short code could not be generated");

  // Step 3: Check if short code already in use
  const codeExists = await urlRepo.findOneBy({ short_code });
  if (codeExists) throw new Error("Short code already exists");

  // Step 4: Save new short URL
  const newUrl = new ShortUrl();
  newUrl.original_url = original_url;
  newUrl.short_code = short_code;
  newUrl.user = user;

  if (expires_in_days) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expires_in_days);
    newUrl.expires_at = expiry;
  }

  await urlRepo.save(newUrl);

  return {
    isNew: true,
    message: "Short URL created successfully",
    short_code: short_code,
    short_url: `http://localhost:8000/${short_code}`,
  };
};

// 🔑 Utility to get available short code from KGS
const getAvailableKeyFromKGS = async (): Promise<string | null> => {
  const kgsRepo = AppDataSource.getRepository(KGSKey);

  const key = await kgsRepo
    .createQueryBuilder()
    .where("is_used = false")
    .orderBy("RANDOM()")
    .getOne();

  if (!key) return null;

  key.is_used = true;
  await kgsRepo.save(key);

  return key.short_code;
};
