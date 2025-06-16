import IController from "../../types/IController";
import axios from "axios";
import { AppDataSource } from "../../ormconfig";
import apiResponse from "../utilities/apiResponse";
import { User } from "../../entities/user/User";
import { ShortUrl } from "../../entities/url/ShortUrl";
import { UrlAccessLog } from "../../entities/url/UrlAccessLog";

// const renderAdminDashboard: IController = async (req, res) => {
//   try {
//     console.log("inside renn");
//     //     const [statsRes, topUrlsRes] = await Promise.all([
//     //       axios.get("http://localhost:8080/api/v1/admin/stats"),
//     //       axios.get("http://localhost:8080/api/v1/admin/top-urls"),
//     //     ]);

//     //     return apiResponse.render(res, "admin/dashboard", {
//     //       stats: statsRes.data,
//     //       topUrls: topUrlsRes.data,
//     //       error: null,
//     return res.render("dashboard");
//     //     });
//   } catch (err: any) {
//     console.error("❌ Admin dashboard API error:", {
//       message: err?.message,
//       stack: err?.stack,
//       response: err?.response?.data,
//     });
//     //   return apiResponse.render(
//     //     res,
//     //     "dashboard",
//     //     {
//     //       stats: null,
//     //       topUrls: [],
//     //       error: "Unable to fetch dashboard data.",
//     //     },
//     //     500
//     //   );
//   }
// };

const renderAdminDashboard: IController = async (req, res) => {
  try {
    // Fetch total users
    const totalUsers = await AppDataSource.getRepository(User).count();

    // Fetch total short URLs
    const totalUrls = await AppDataSource.getRepository(ShortUrl).count();

    // Fetch total redirects
    const { totalRedirects } = await AppDataSource.getRepository(UrlAccessLog)
      .createQueryBuilder("log")
      .select("COUNT(*)", "totalRedirects")
      .getRawOne();

    // Fetch top 5 URLs by clicks
    const topUrlsRaw = await AppDataSource.getRepository(UrlAccessLog)
      .createQueryBuilder("log")
      .leftJoin("log.shortUrl", "url")
      .select("url.original_url", "original_url")
      .addSelect("url.short_code", "short_code")
      .addSelect("url.custom_alias", "custom_alias")
      .addSelect("COUNT(log.id)", "clicks")
      .groupBy("url.id")
      .orderBy("clicks", "DESC")
      .limit(5)
      .getRawMany();

    const topUrls = topUrlsRaw.map((u) => ({
      original: u.original_url,
      code: u.custom_alias || u.short_code,
      clicks: parseInt(u.clicks),
    }));

    // Redirects by country
    const countryStatsRaw = await AppDataSource.getRepository(UrlAccessLog)
      .createQueryBuilder("log")
      .select("log.country", "country")
      .addSelect("COUNT(*)", "count")
      .groupBy("log.country")
      .orderBy("count", "DESC")
      .getRawMany();

    const countryStats = countryStatsRaw.map((c) => ({
      country: c.country || "Unknown",
      count: parseInt(c.count),
    }));

    // Redirects by referrer
    const referrerStatsRaw = await AppDataSource.getRepository(UrlAccessLog)
      .createQueryBuilder("log")
      .select("log.referrer", "referrer")
      .addSelect("COUNT(*)", "count")
      .groupBy("log.referrer")
      .orderBy("count", "DESC")
      .getRawMany();

    const referrerStats = referrerStatsRaw.map((r) => ({
      referrer: r.referrer || "Direct",
      count: parseInt(r.count),
    }));

    // 🧠 Send to EJS view
    return apiResponse.render(res, "admin/dashboard", {
      stats: {
        users: totalUsers,
        urls: totalUrls,
        totalRedirects: parseInt(totalRedirects),
      },
      topUrls,
      countryStats,
      referrerStats,
      error: null,
    });
  } catch (err: any) {
    console.error("❌ Dashboard error:", err);
    return apiResponse.render(
      res,
      "admin/dashboard",
      {
        stats: null,
        topUrls: [],
        countryStats: [],
        referrerStats: [],
        error: "Something went wrong while loading the dashboard.",
      },
      500
    );
  }
};

export default { renderAdminDashboard };
