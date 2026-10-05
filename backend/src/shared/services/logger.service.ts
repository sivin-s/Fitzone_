import {injectable} from 'inversify';
import type {Logger} from "pino";
import { createLogger } from '../../config/logger.config';
import type { ILogger } from '../interfaces/ILogger.interface';
import path from 'path';
import fs from 'fs'

//  path
import {packageDirectorySync} from 'package-directory';

const repoRoot = packageDirectorySync() as string;
//  eg: return - \Fitzone_\backend -> root directory

@injectable()
export class LoggerService implements ILogger{
    private adminLogger:Logger;
    private userLogger: Logger;

    constructor(){
        const logDirectory = path.join(repoRoot,'logs') // log dir
        if(!fs.existsSync(logDirectory)){
            fs.mkdirSync(logDirectory, {recursive: true})
        }
        const adminLogPath = path.join(logDirectory, "admin.log");
        const userLogPath = path.join(logDirectory,"user.log");
        this.adminLogger = createLogger(adminLogPath);
        this.userLogger = createLogger(userLogPath)
    }

    info(message: unknown, isAdmin?: boolean):void{
        if(isAdmin){
            this.adminLogger.info(message);
        }else{
            this.userLogger.info(message)
        }
    }

    error(message: unknown, isAdmin?: boolean): void {
        if(isAdmin){
            this.adminLogger.error(message)
        }else{
            this.userLogger.error(message)
        }
    }

    warn(message: unknown, isAdmin?: boolean): void {
        if(isAdmin){
            this.adminLogger.warn(message);
        }else{
            this.userLogger.warn(message)
        }
    }

    debug(message: unknown, isAdmin?: boolean): void {
        if(isAdmin){
            this.adminLogger.debug(message);
        }else{
            this.userLogger.debug(message)
        }
    }
}



















