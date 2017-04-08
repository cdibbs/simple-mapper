import { ILogService, IConfig } from './services/i';

export function LoggerFactory(config: IConfig, userLogger: ILogService) {
    if (config.logger) {
        config.logger.warn("The logger config option is deprecated. Please inject your logger using MapperLoggerToken within the providers. See docs.");
        return config.logger;
    }

    return userLogger;
}