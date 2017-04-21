/* tslint:disable:no-unused-variable */
import { ClassProvider, ValueProvider } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';

import { SimpleMapperModule } from './simple-mapper.module';
import { IConfig, SimpleMapperLoggerToken, ILogService } from '../services/i';

describe('SimpleMapperModule without user logger', () => {
    beforeEach(() => {
        let config = <IConfig>{

        };
        let providers = SimpleMapperModule.forRoot(config).providers;
        TestBed.configureTestingModule({
            imports: [
            ],
            providers
        });
    });

    it('should use default logger.', inject([SimpleMapperLoggerToken], (logger: ILogService) => {
        expect(logger).toBe(console);
    }));
});

describe('SimpleMapperModule with user logger', () => {
    class MockConsole {
        public error(message?: any, ...optional: any[]): void { }
        public log(message?: any, ...optional: any[]): void { }
        public warn(message?: any, ...optional: any[]): void { }
        public info(message?: any, ...optional: any[]): void { }
    }
    let mockCon = new MockConsole();
    beforeEach(() => {
        let config = <IConfig>{
            viewModels: {
            
            }
        };
        let providers = SimpleMapperModule.forRoot(config).providers;
        providers.push({ provide: SimpleMapperLoggerToken, useValue: mockCon });
        TestBed.configureTestingModule({
            imports: [
            ],
            providers
        });
    });

    it('should use user-injected logger.', inject([SimpleMapperLoggerToken], (logger: ILogService) => {
        expect(logger).toBe(mockCon);
    }));
});
