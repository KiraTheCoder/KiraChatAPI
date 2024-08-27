import { logger } from "@src/logger";
import { Request, Response, NextFunction } from "express";
import requestIp from 'request-ip'

const requestIpMiddleware = (req:Request, res:Response, next:NextFunction)=>{
    const clientIp = requestIp.getClientIp(req);
    logger.info(`Client IP is :: ${clientIp}`, {
        __filename
    });
    next();
}

export{ requestIpMiddleware};