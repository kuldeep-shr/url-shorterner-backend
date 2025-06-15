import IController from "../../types/IController";

import { shortenUrl } from "../services/url.service";
import httpStatusCodes from "http-status-codes";

const handleShortenUrl: IController = async (req, res) => {
  try {
    const { url, custom_alias, expires_in_days } = req.body;
    const user = "4c9df27f-b275-4d4e-b653-43b3aad1206e";

    if (!url) return res.status(400).json({ error: "Missing URL" });

    const result = await shortenUrl({
      original_url: url,
      custom_alias,
      expires_in_days,
      user_id: user,
    });

    return res.status(201).json({
      short_code: result.short_code,
      short_url: `http://localhost:3000/${result.short_code}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export default { handleShortenUrl };
