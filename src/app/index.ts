import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapperService, MapperConfiguration } from './services/mapper.service';
import { IConfig } from './services/i';

export * from './services/mapper.service';
export * from './services/i';
export * from './decorators/mappable.decorator';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MapperService
  ],
  exports: [
  ]
})
export class SimpleMapperModule {
  static forRoot(config: IConfig): ModuleWithProviders {
    return {
      ngModule: SimpleMapperModule,
      providers: [
        MapperService,
        { provide: MapperConfiguration, useValue: config }
      ]
    };
  }
}
