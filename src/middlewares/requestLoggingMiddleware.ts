// Middleware function for logging the request method and request URL
import { logger } from '@src/logger';
import { Request, Response, NextFunction } from 'express';
const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  const fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
  logger.info(
    `${request.method} method :: URL ${fullUrl} :: Hostname ${request.hostname} :: User-agent ${request.get(
      'User-Agent'
    )}`,
    {
      __filename,
    }
  );
  logger.info(`Body :: ${JSON.stringify(request.body)}`, { __filename });
  const start = Date.now();

  response.on('finish', () => {
    const elapsed = Date.now() - start;
    logger.info(`Response Status :: ${response.statusCode}`, {
      __filename,
    });
    logger.info(`Response Took :: ${elapsed} ms`, {
      __filename,
    });
  });
  next();
};

export {requestLogger};
