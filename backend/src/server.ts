import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import app from './app.ts';
import {connectDB} from "./config/database.config.ts";


// DI container
import {appContainer} from './DiContainer/DiContainer.ts'

// type
import { LOGGER_TYPES } from "./DITypes/Index.DIType.ts";
import type { ILogger } from "./shared/interfaces/ILogger.interface.ts";

// retrieve the singleton LoggerService from the DI Container
const logger = appContainer.get<ILogger>(LOGGER_TYPES.ILogger);

const PORT = process.env.PORT || 8080;

const startServer = async ()=>{
    connectDB().then(()=>{
          app.listen(PORT, () => logger.info(`server started 🌐 ,${PORT}`));
    }).catch((error: unknown)=>{
        logger.error(
            "server startup failed: " +
            (error instanceof Error ? error.message : String(error))
        );
        process.exit(1)
    })
}


startServer();