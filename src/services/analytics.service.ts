import { AppDataSource } from "../../ormconfig";
import { UrlAccessLog } from "../../entities/url/UrlAccessLog";
import { ShortUrl } from "../../entities/url/ShortUrl";

export const getAnalyticsData = async (short_code: string) => {
  const shortUrlRepo = AppDataSource.getRepository(ShortUrl);
  const logRepo = AppDataSource.getRepository(UrlAccessLog);

  const shortUrl: any = await shortUrlRepo.findOneBy({ short_code });
  if (!shortUrl) throw new Error("Short URL not found");

  const shortUrlId = shortUrl.id;

  const [totalRedirects, lastAccesses, referrerStats, countryStats] =
    await Promise.all([
      // Total number of visits
      logRepo.count({ where: { shortUrlId } }),

      // Last 5 access timestamps
      logRepo.find({
        where: { shortUrlId },
        order: { accessed_at: "DESC" },
        take: 5,
        select: ["accessed_at"],
      }),

      // Referrer breakdown
      logRepo
        .createQueryBuilder("log")
        .select("log.referrer", "referrer")
        .addSelect("COUNT(*)", "count")
        .where("log.shortUrlId = :id", { id: shortUrlId })
        .groupBy("log.referrer")
        .orderBy("count", "DESC")
        .getRawMany(),

      // Country/IP breakdown
      logRepo
        .createQueryBuilder("log")
        .select("log.country", "country")
        .addSelect("COUNT(*)", "count")
        .where("log.shortUrlId = :id", { id: shortUrlId })
        .groupBy("log.country")
        .orderBy("count", "DESC")
        .getRawMany(),
    ]);

  return {
    short_code,
    total_redirects: totalRedirects,
    last_accesses: lastAccesses.map((entry) => entry.accessed_at),
    referrer_stats: referrerStats,
    country_stats: countryStats,
  };
};
