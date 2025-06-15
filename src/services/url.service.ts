import { AppDataSource } from "../../ormconfig";
import { ShortUrl } from "../../entities/url/ShortUrl";
import { User } from "../../entities/user/User";
import { generateShortCode } from "../utilities/encryptionUtils";

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

  const user = await userRepo.findOneBy({ id: user_id });
  console.log("user", user);
  if (!user) throw new Error("User not found");

  const short_code: any = custom_alias?.trim() || (await generateShortCode());
  if (!short_code) throw new Error("Short code could not be generated");

  const exists = await urlRepo.findOneBy({ short_code: short_code });
  console.log("exists url", exists, "short", short_code);
  if (exists) throw new Error("Short code already exists");

  const newUrl = new ShortUrl();
  newUrl.original_url = original_url;
  newUrl.short_code = short_code;
  newUrl.user = user;

  if (expires_in_days) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expires_in_days);
    newUrl.expires_at = expiry;
  }

  const saved = await urlRepo.save(newUrl);
  return saved;
};
