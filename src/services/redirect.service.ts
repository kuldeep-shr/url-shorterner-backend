import { AppDataSource } from "../../ormconfig";
import { ShortUrl } from "../../entities/url/ShortUrl";
import { UrlAccessLog } from "../../entities/url/UrlAccessLog";

export const handleRedirect = async (shortCode: string, req: any) => {
  const shortUrlRepo = AppDataSource.getRepository(ShortUrl);
  const accessLogRepo = AppDataSource.getRepository(UrlAccessLog);

  const shortUrl = await shortUrlRepo.findOne({
    where: { short_code: shortCode },
    relations: ["user"],
  });

  if (!shortUrl) {
    throw new Error("Short URL not found");
  }

  // Log the access
  const accessLog = new UrlAccessLog();
  accessLog.shortUrl = shortUrl;
  accessLog.ip_address = req.ip || req.headers["x-forwarded-for"] || "unknown";
  accessLog.referrer = req.get("referrer") || req.get("referer") || "direct";
  accessLog.country = "IN";

  await accessLogRepo.save(accessLog);

  return shortUrl.original_url;
};
