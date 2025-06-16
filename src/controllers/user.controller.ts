import httpStatusCodes from "http-status-codes";
import constants from "../constants";
import locale from "../constants/locale";
import IController from "../../types/IController";
import apiResponse from "../utilities/apiResponse";
import userService from "../services/user.service";

const login: IController = async (req, res) => {
  const user: any = await userService.loginUser(
    req.body.email,
    req.body.password
  );
  if (user) {
    apiResponse.result(res, user, httpStatusCodes.OK);
  } else {
    apiResponse.error(
      res,
      httpStatusCodes.BAD_GATEWAY,
      locale.INVALID_CREDENTIALS
    );
  }
};

const register: IController = async (req, res) => {
  let user;
  try {
    user = await userService.createUser(
      req.body.email,
      req.body.password,
      req.body.name
    );
  } catch (e: any) {
    if (e.code == 23505) {
      apiResponse.error(
        res,
        httpStatusCodes.BAD_REQUEST,
        locale.EMAIL_ALREADY_EXISTS
      );
      return;
    }
  }
  if (user) {
    apiResponse.result(res, user, httpStatusCodes.CREATED);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_GATEWAY);
  }
};

export default {
  login,
  register,
  //   self,
};
