import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import app from './app.ts';
import {connectDB} from "./config/database.config.ts";
import { logger } from "./config/logger.config.ts";

// DI container


// type


// retrieve the singleton LoggerService from the DI Container


const PORT = process.env.PORT || 8080;

const startServer = async ()=>{
    connectDB().then(()=>{
          app.listen(PORT, () => console.info(`server started 🌐 ,${PORT}`));
    }).catch((error: unknown)=>{
        console.error(
            "server startup failed: " +
            (error instanceof Error ? error.message : String(error))
        );
        process.exit(1)
    })
}


startServer();