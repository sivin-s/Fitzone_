import {Container} from 'inversify';
import type { ILogger } from '../shared/interfaces/ILogger.interface';
import { AUTH_TYPES, LOGGER_TYPES } from '../DITypes/Index.DIType';
import { LoggerService } from '../shared/services/logger.service';
import { IAuthController } from '../modules/auth/interfaces/IAuthController.interface';
import { AuthController } from '../modules/auth/controllers/auth.controller';
import type { IAuthService } from '../modules/auth/interfaces/IAuthService.interface';
import { AuthService } from '../modules/auth/services/auth.service';
import type { IAuthRepository } from '../modules/auth/interfaces/IAuthRepository.interface';
import { AuthRepository } from '../modules/auth/repositories/auth.repository';




// create one shared container
const appContainer = new Container();

// bind global services - logger 
appContainer.bind<ILogger>(LOGGER_TYPES.ILogger)
.to(LoggerService)
.inSingletonScope(); // create single instance shared to all (prevent reconfig)

// Auth module
appContainer.bind<IAuthController>(AUTH_TYPES.IAuthController)
.to(AuthController);
appContainer.bind<IAuthService>(AUTH_TYPES.IAuthService).to(AuthService);
appContainer.bind<IAuthRepository>(AUTH_TYPES.IAuthRepository).to(AuthRepository);


// Admin module





// export
export {appContainer}





