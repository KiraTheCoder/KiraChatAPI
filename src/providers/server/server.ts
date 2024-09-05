import { logger } from "@src/logger";
import { Application } from "express";
import http from "http"
import { availableParallelism } from 'node:os';
import cluster from 'cluster';

import { Server } from "socket.io";
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter');

import { jwtVerifyToken } from "@src/services/lib/jwt/jwtTokenVerify"
import { socketFn } from "@src/services/utils";

export const ServerApp = (app: Application, PORT: number | string) => {
  const cpuNums: number = availableParallelism();

  if (cluster.isPrimary) {
    for (let i = 0; i < cpuNums; i++) {
      cluster.fork();
      return setupPrimary()
    }

    cluster.on('exit', () => {
      cluster.fork();
      return setupPrimary()
    });
  } else {

    const server = http.createServer(app)
    const io = new Server(server, {
      cors: {
        origin: ["*", "http://localhost:4200"],
        methods: ["GET", "POST"],
      },
      connectionStateRecovery: {},
      adapter: createAdapter()
    });
    

    io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (token) {
        try {
          const user = jwtVerifyToken(token);
          (socket as any).userId = (user as any).userId;
          next();
        } catch (err) {
          next(new Error('Invalid or expired token'));
        }
      } else {
        next(new Error('Token not provided'));
      }
    });


    socketFn(io);

    server.listen(PORT, () => {
      logger.info(`Server Running on port ${PORT} ☁️  and PID ${process.pid} ⛈️`, {
        __filename
      });
    }).on('error', (_error) => {
      logger.error(`Error while starting server ${_error.message}`, { __filename });
      process.exit(1);
    })
  }

}
