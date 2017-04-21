import { InjectionToken } from '@angular/core';

/**
 * Don't forget - even console should work as an ILogService:
 * let logger: ILogService = console;
 **/
export interface ILogService {
  /** Use like console.error. */
  error(message?: any, ...optional: any[]): void;

  /** Use like console.log. */
  log(message?: any, ...optional: any[]): void;

  /** Use like console.warn. */
  warn(message?: any, ...optional: any[]): void;

  /** Use like console.info. */
  info(message?: any, ...optional: any[]): void;
}


export let SimpleMapperLoggerToken = new InjectionToken<ILogService>("ILogService_User");
export let LoggerToken = new InjectionToken<ILogService>("ILogService");