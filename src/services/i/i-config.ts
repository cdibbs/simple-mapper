import { ILogService } from './i-log.service';

export interface IConfig {
   /** Deprecated. A logger with a signature matching console. Defaults to console.
    * Use MapperLoggerToken in your providers, instead.
    */
    logger?: ILogService;

    /** The dictionary of view models to use for recursive mapping. 
      * Not needed if using object references in @mappable() instead of names.
      * Default: empty. */
    viewModels?: { [key: string]: any };

    /** Validate mapping configuration on startup. (Do mappable names exist in view models?)
     * Default: false.
     */
    validateOnStartup?: boolean;

    /** Turn off unmapped source property warnings globally. Can be overridden at the method level. */
    noUnmappedWarnings?: boolean;
}