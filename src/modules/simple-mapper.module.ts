
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapperService, MapperServiceToken, MapperConfiguration } from '../services/mapper.service';
import { IConfig, MapperLoggerToken } from '../services/i';

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
        { provide: MapperLoggerToken, useValue: console }
      ]
    };
  }
}