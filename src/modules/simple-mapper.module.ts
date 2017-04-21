import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IConfig, SimpleMapperLoggerToken, LoggerToken } from '../services/i';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class SimpleMapperModule {
  static forRoot(config: IConfig): ModuleWithProviders {
    return {
      ngModule: SimpleMapperModule,
      providers: [
        { provide: LoggerToken, useValue: console },
        { provide: SimpleMapperLoggerToken, useExisting: LoggerToken }
      ]
    };
  }
}
