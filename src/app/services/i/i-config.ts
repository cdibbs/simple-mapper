import { ILogService } from './i-log.service';

export interface IConfig {
    /** A logger with a signature matching console. Defaults to console. */
    logger?: ILogService;

    /** The dictionary of view models to use for recursive mapping. Default: empty. */
    viewModels?: { [key: string]: any };

    /** Validate mapping configuration on startup. Default: false. */
    validateOnStartup?: boolean;
}