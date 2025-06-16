import { AppDataSource } from "../../ormconfig";

export const getAnalyticsData = async (short_code: string) => {
  const db = AppDataSource.manager;

  try {
    // Step 1: Get short URL details
    const shortUrl = await db.query(
      `SELECT id FROM short_urls WHERE short_code = $1 LIMIT 1`,
      [short_code]
    );

    if (!shortUrl.length) {
      throw new Error("Short URL not found");
    }

    const shortUrlId = shortUrl[0].id;

    // Step 2: Fetch all 4 analytics in parallel calls
    const [totalRedirects, lastAccesses, referrerStats, countryStats] =
      await Promise.all([
        // Total redirects count
        db.query(
          `SELECT COUNT(*)::INT as total FROM url_access_logs WHERE short_url_id = $1`,
          [shortUrlId]
        ),

        // Last 5 access timestamps
        db.query(
          `SELECT accessed_at FROM url_access_logs
           WHERE short_url_id = $1
           ORDER BY accessed_at DESC
           LIMIT 5`,
          [shortUrlId]
        ),

        // Referrer stats
        db.query(
          `SELECT referrer, COUNT(*)::INT as count
           FROM url_access_logs
           WHERE short_url_id = $1
           GROUP BY referrer
           ORDER BY count DESC`,
          [shortUrlId]
        ),

        // Country stats
        db.query(
          `SELECT country, COUNT(*)::INT as count
           FROM url_access_logs
           WHERE short_url_id = $1
           GROUP BY country
           ORDER BY count DESC`,
          [shortUrlId]
        ),
      ]);

    return {
      short_code,
      total_redirects: totalRedirects[0]?.total || 0,
      last_accesses: lastAccesses.map((row: any) => row.accessed_at),
      referrer_stats: referrerStats,
      country_stats: countryStats,
    };
  } catch (err: any) {
    console.error("Error getting analytics:", err.message);
    throw new Error("Failed to fetch analytics data");
  }
};
