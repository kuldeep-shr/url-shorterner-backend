import IController from "../../types/IController";
import apiResponse from "../utilities/apiResponse";
import { getAnalyticsData } from "../services/analytics.service";
import httpStatusCodes from "http-status-codes";

const getAnalytics: IController = async (req, res) => {
  try {
    const { code } = req.params;
    const analytics = await getAnalyticsData(code);
    return apiResponse.result(res, analytics, httpStatusCodes.OK);
  } catch (error: any) {
    return apiResponse.error(
      res,
      httpStatusCodes.BAD_GATEWAY,
      error.message || "Something went wrong"
    );
  }
};

export default { getAnalytics };
