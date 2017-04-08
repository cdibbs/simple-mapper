import { InjectionToken } from '@angular/core';

export interface ILogService {
  error(message?: any, ...optional: any[]): void;
  log(message?: any, ...optional: any[]): void;
  warn(message?: any, ...optional: any[]): void;
  info(message?: any, ...optional: any[]): void;
}

export let MapperLoggerToken = new InjectionToken<ILogService>("ILogService_User");
export let LoggerToken = new InjectionToken<ILogService>("ILogService");
export let DefaultLoggerToken = new InjectionToken<ILogService>("ILogService_Default");