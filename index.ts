import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapperService } from './src/mapper.service';

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
    MapperService
  ]
})
export class SimpleMapperModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SimpleMapperModule,
      providers: [MapperService]
    };
  }
}
