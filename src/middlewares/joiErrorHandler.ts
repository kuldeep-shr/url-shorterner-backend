import express from "express";
import { ValidationError } from "joi";
import httpStatusCodes from "http-status-codes";
import { CelebrateError, isCelebrateError } from "celebrate";

/**
 * Joi error handler middleware
 *
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */
export default (
  err: CelebrateError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (isCelebrateError(err)) {
    const details: string[] = [];
    err.details.forEach((error1: ValidationError) =>
      error1.details.forEach((value) => details.push(value.message))
    );
    const error = {
      details: details.join(","),
      code: httpStatusCodes.BAD_REQUEST,
      message: httpStatusCodes.getStatusText(httpStatusCodes.BAD_REQUEST),
    };
    return res.status(httpStatusCodes.BAD_REQUEST).json(error);
  }
  return next(err);
};
