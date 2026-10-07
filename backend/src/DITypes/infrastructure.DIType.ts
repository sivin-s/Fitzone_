export const INFRA_TYPES={  // Infrastructure external tools and services like dbs, redis
    IOtpService: Symbol.for("IOtpService"),
    IEmailService: Symbol.for("IEmailService"),
    IJwtService: Symbol.for("IJwtService"),
    IStorageProvider: Symbol.for("IStorageProvider"),
    IGoogleAuthProvider: Symbol.for("IGoogleAuthProvider"),
    ISessionService: Symbol.for("ISessionService"),
    IUserReader: Symbol.for("IUserReader"),
    IUserProfileRepository: Symbol.for("IUserProfileRepository")
}