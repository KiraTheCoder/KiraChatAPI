import "module-alias/register";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser"
import cors from 'cors'
import { configureRoutes, corsOptions } from "./config";
import { errorLogger, errorResponder, notFound, requestIpMiddleware, requestLogger } from "./middlewares";
import { ServerApp, connectDatabase } from "./providers";
import mongoose from "mongoose";



dotenv.config();
connectDatabase();
const PORT = process.env.PORT || 8000;
const app: Express = express();
app.use(helmet());


app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  next();
})


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser())
app.use(requestIpMiddleware);
app.use(requestLogger)

configureRoutes(app);

// globally validator on
mongoose.set('runValidators', true);


app.get("/", (req: Request, res: Response) => {
  res.json({ route: "This is root route" });
});

app.use(errorLogger);
app.use(errorResponder);
app.use(notFound);

ServerApp(app, PORT);