import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapperService, MapperConfiguration } from './src/mapper.service';
import { IConfig } from './src/i';

export * from './src/mapper.service';
export * from './src/i';
export * from './src/decorators/mappable.decorator';

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
