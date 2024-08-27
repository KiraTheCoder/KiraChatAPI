import { ErrorConstant } from '@src/constants';
import { logger } from '@src/logger';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
class AppError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

const errorLogger = (error: Error, request: Request, response: Response, next: NextFunction) => {
  logger.error(`Stack Error :: ${error}`)
  logger.error(`Error :: ${error.message}`,{
    __filename
  });
  next(error);
};

const errorResponder = (error: AppError, request: Request, response: Response, next: NextFunction) => {
  response.header('Content-Type', 'application/json');
  if(error.name === 'MongoServerError'){
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorConstant.INTERNAL_SERVER_ERROR);
  }
  const status = error.statusCode || 400;
  return response.status(status).json({error:error.message, code:'ERR-400'});
};


const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Requested URL Not Found - ${req.originalUrl} :: method ${req.method}`);
  return res.status(401).json({ message: error.message });
};


export {errorLogger, errorResponder, notFound}
