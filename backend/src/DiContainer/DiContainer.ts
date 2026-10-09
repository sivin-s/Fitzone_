import {Container} from 'inversify';
import type { ILogger } from '../shared/interfaces/ILogger.interface';
import { ADMIN_TYPES, AUTH_TYPES, LOGGER_TYPES, USER_TYPES } from '../DITypes/Index.DIType';
import { LoggerService } from '../shared/services/logger.service';
import { IAuthController } from '../modules/auth/interfaces/IAuthController.interface';
import { AuthController } from '../modules/auth/controllers/auth.controller';
import type { IAuthService } from '../modules/auth/interfaces/IAuthService.interface';
import { AuthService } from '../modules/auth/services/auth.service';
import type { IAuthRepository } from '../modules/auth/interfaces/IAuthRepository.interface';
import { AuthRepository } from '../modules/auth/repositories/auth.repository';
import type { IUserService } from '../modules/users/interfaces/IUserService.interface';
import { UserController } from '../modules/users/controllers/user.controller';
import type { IUserController } from '../modules/users/interfaces/IUserController.interface';
import { UserService } from '../modules/users/services/user.services';
import { INFRA_TYPES } from '../DITypes/infrastructure.DIType';
import { OtpService } from '../shared/services/otp.service';
import { redisClient } from '../config/redis.config';
import { EmailService } from '../shared/services/email.service';
import { JwtService } from '../shared/services/jwt.service';
import { S3StorageProvider } from '../shared/services/s3StorageProvider.services';
import { GoogleAuthProvider } from '../shared/services/googleAuthProvider.service';
import { SessionService } from '../shared/services/session.service';
import type { IAdminController } from '../modules/admin/interfaces/IAdminController.interface';
import { AdminController } from '../modules/admin/controllers/admin.controller';
import type { IAdminService } from '../modules/admin/interfaces/IAdminService.interface';
import { AdminService } from '../modules/admin/services/admin.service';
import type { IAdminRepository } from '../modules/admin/interfaces/IAdminRepository.interface';
import { AdminRepository } from '../modules/admin/repositories/admin.repository';
import type { IUserProfileRepository } from '../modules/users/interfaces/IUserProfileRepository.interface';
import { UserProfileRepository } from '../modules/users/repositories/userProfile.repository';




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

// user module
appContainer.bind<IUserController>(USER_TYPES.IUserController).to(UserController);
appContainer.bind<IUserService>(USER_TYPES.IUserService).to(UserService)
appContainer.bind<IUserProfileRepository>(USER_TYPES.IUserProfileRepository).to(UserProfileRepository)

// Infrastructure - external tools and dbs
appContainer.bind(INFRA_TYPES.IOtpService)
    .toDynamicValue(()=> new OtpService(redisClient)) //  used to injecting prebuild instance (eg: redis instances)
    .inSingletonScope() // create instance once and reuse - keep consistently no repeating
appContainer
    .bind(INFRA_TYPES.IEmailService)
    .toDynamicValue(()=> new EmailService())
    .inSingletonScope();
appContainer
    .bind(INFRA_TYPES.IJwtService)
    .toDynamicValue(()=> new JwtService())
    .inSingletonScope();
appContainer
    .bind(INFRA_TYPES.IStorageProvider)
    .toDynamicValue(()=> new S3StorageProvider())
    .inSingletonScope();
appContainer
    .bind(INFRA_TYPES.IGoogleAuthProvider)
    .toDynamicValue(()=> new GoogleAuthProvider())

// Session service
appContainer
    .bind(INFRA_TYPES.ISessionService).to(SessionService)

// Admin module
appContainer.bind<IAdminController>(ADMIN_TYPES.IAdminController).to(AdminController);
appContainer.bind<IAdminService>(ADMIN_TYPES.IAdminService).to(AdminService);
appContainer.bind<IAdminRepository>(ADMIN_TYPES.IAdminRepository).to(AdminRepository);



// export
export {appContainer}





