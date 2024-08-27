import jwt from "jsonwebtoken";
import { logger } from '@src/logger';

function jwtGetToken(id: object): string {
    logger.info(`token generation starts.`, { __filename })
    const key: string | undefined = process.env.JWT_SECRET_KEY;
    const expires: string | undefined = process.env.JWT_EXPIRES_IN;

    if (!key || !expires) 
    { throw new Error("JWT_SECRET_KEY or JWT_EXPIRES_IN is not defined in environment variables") }
    
    const options: { expiresIn: string | undefined } = { expiresIn: expires };

  const payload = { userId: id }
      try {
          const token = jwt.sign(payload, key,options);
          return token;
        
      } catch (error) {
          logger.error(`Exception occurred at generateToken function ${error}`, { __filename })
          throw new Error('Token generation failed');
        }
}
export { jwtGetToken };
