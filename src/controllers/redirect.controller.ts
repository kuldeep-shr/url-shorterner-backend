import IController from "../../types/IController";
import { handleRedirect } from "../services/redirect.service";
import httpStatusCodes from "http-status-codes";
import apiResponse from "../utilities/apiResponse";

const redirectToOriginal: IController = async (req, res) => {
  const { code } = req.params;
  try {
    const originalUrl = await handleRedirect(code, req);
    apiResponse.redirect(res, originalUrl);
  } catch (error: any) {
    apiResponse.error(res, httpStatusCodes.BAD_GATEWAY, "Something went wrong");
  }
};

export default { redirectToOriginal };
