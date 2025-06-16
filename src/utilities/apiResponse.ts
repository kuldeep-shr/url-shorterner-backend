import { Response } from "express";
import httpStatusCodes from "http-status-codes";

export interface IOverrideRequest {
  code: number;
  message: string;
  positive: string;
  negative: string;
}

export interface ICookie {
  key: string;
  value: string;
}

export default class ApiResponse {
  static result = (
    res: Response,
    data: object,
    status: number = 200,
    message?: string
  ) => {
    return res.status(status).json({
      data,
      success: true,
      message,
    });
  };

  static error = (
    res: Response,
    status: number = 400,
    error: string = httpStatusCodes.getStatusText(status)
  ) => {
    return res.status(status).json({
      error: {
        message: error,
      },
      success: false,
    });
  };

  static setCookie = (res: Response, key: string, value: string) => {
    return res.cookie(key, value);
  };

  static redirect = (res: Response, url: string, status: number = 301) => {
    return res.redirect(status, url);
  };
  static render = (
    res: Response,
    view: string,
    params?: object,
    status: number = 200
  ) => {
    return res.status(status).render(view, params);
  };
}
