
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapperService, MapperServiceToken, MapperConfiguration } from './services/mapper.service';
import { IConfig, LoggerToken, DefaultLoggerToken, MapperLoggerToken } from './services/i';
import { LoggerFactory } from './logger-factory';

export * from './services/mapper.service';
export * from './services/i';
export * from './decorators/mappable.decorator';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: []
})
export class SimpleMapperModule {
  static forRoot(config: IConfig): ModuleWithProviders {
    return {
      ngModule: SimpleMapperModule,
      providers: [
        MapperService,
        { provide: MapperServiceToken, useClass: MapperService },
        { provide: MapperConfiguration, useValue: config },
        { provide: MapperLoggerToken, useValue: console },
        { provide: LoggerToken, useFactory: LoggerFactory, deps: [MapperConfiguration, MapperLoggerToken] }
      ]
    };
  }
}