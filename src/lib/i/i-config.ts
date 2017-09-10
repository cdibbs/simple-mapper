import { ILogService } from './i-log.service';

export interface IConfig {
    /** The dictionary of models to use for recursive mapping. 
      * Not needed if using object references in @mappable() instead of names.
      * Default: empty. */
    models?: { [key: string]: any };

    /** Validate mapping configuration on startup. (Do mappable names exist in view models?)
     * Default: false.
     */
    validateOnStartup?: boolean;

    /** Turn off unmapped source property warnings globally. Can be overridden at the method level. */
    noUnmappedWarnings?: boolean;
}