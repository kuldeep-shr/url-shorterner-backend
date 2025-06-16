import IController from "../../types/IController";
import { shortenUrl } from "../services/url.service";
import httpStatusCodes from "http-status-codes";
import apiResponse from "../utilities/apiResponse";

const handleShortenUrl: IController = async (req, res) => {
  try {
    const { url, custom_alias, expires_in_days } = req.body;
    const user = req.user;
    console.log("in token", user);
    if (!url) return res.status(400).json({ error: "Missing URL" });

    const result: any = await shortenUrl({
      original_url: url,
      custom_alias,
      expires_in_days,
      user_id: user.id,
    });

    const returnData = {
      short_code: result.short_code,
      short_url: `http://localhost:8000/${result.short_code}`,
    };

    apiResponse.result(
      res,
      returnData,
      httpStatusCodes.OK,
      result.isNew ? "your url is ready" : result.message
    );
  } catch (err: any) {
    apiResponse.error(res, httpStatusCodes.BAD_GATEWAY, "Something went wrong");
  }
};

export default { handleShortenUrl };
