import jwt from "jsonwebtoken";
import { logger } from '@src/logger';

function jwtVerifyToken(token: string): object {
    logger.info(`token validator starts.`, { __filename })
    const key: string | undefined = process.env.JWT_SECRET_KEY;

    if (!key ) 
    { throw new Error("JWT_SECRET_KEY is not defined in environment variables") }
      try {
          const decode = jwt.verify(token, key);
          return decode;
        
      } catch (error) {
          logger.error(`Exception occurred at validation function ${error}`, { __filename })
          throw new Error('Token validator failed');
        }
}
export { jwtVerifyToken };
