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
    res.status(status);
    res.json({
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
    res.status(status).json({
      error: {
        message: error,
      },
      success: false,
    });
  };

  static setCookie = (res: Response, key: string, value: string) => {
    res.cookie(key, value);
  };

  static redirect = (res: Response, url: string, status: number = 302) => {
    res.redirect(status, url);
  };
}
