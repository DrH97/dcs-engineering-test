import { Response, Request, NextFunction } from "express";
import { ValidationError } from "express-json-validator-middleware";
import { logger } from "./utils";

export function validationErrors(
  err: ValidationError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err?.name === "JsonSchemaValidationError") {
    sendErrResponse(res, 422, err.validationErrors);
  }
  next();
}

interface ErrResponseBody {
  errors: unknown;
}

export function sendErrResponse(
  res: Response,
  code: number,
  detail: unknown
): void {
  if (process.env.LOG_ERRORS) {
    logger(`Error ${code}: ${JSON.stringify(detail, undefined, 2)}`);
  }
  const body: ErrResponseBody = { errors: detail };
  res.status(code).send(body);
}
