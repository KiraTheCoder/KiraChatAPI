import {logger} from "@src/logger";
import mongoose, { ConnectOptions, Mongoose } from "mongoose";


let conn!:Mongoose;
const connectDatabase = async ():Promise<any>=>{

    const mongooseUrl = process.env.DB_URI;
    const dbName = process.env.DB_NAME;
    const options = {dbName};

    if(!(mongooseUrl && dbName)){
        logger.info(`Mongoose Url or Db name not found`, {
            __filename
        });
        throw new Error(`Mongoose Url or Db name not found`);
    }

    try{
        mongoose.set('strictQuery', false);
        conn = await mongoose.connect(mongooseUrl, options as ConnectOptions);
        logger.info(`Database Connected Successfully`, {__filename});
        return mongoose.connection;
    }catch(err){
        logger.error(`Error while connecting to db ${err}`, {
            __filename
          });
          throw err;
    }
}

export {connectDatabase, conn};
