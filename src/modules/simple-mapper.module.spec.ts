/* tslint:disable:no-unused-variable */
import { ClassProvider, ValueProvider } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { SimpleMapperModule } from './simple-mapper.module';
import { MapperService, MapperConfiguration } from '../services/mapper.service';
import * as vm from '../test-resources/view-models';
import { IConfig, MapperLoggerToken } from '../services/i';

describe('SimpleMapperModule without user logger', () => {
    beforeEach(() => {
        let config = <IConfig>{
            viewModels: vm
        };
        let providers = SimpleMapperModule.forRoot(config).providers
        TestBed.configureTestingModule({
            providers: providers
        });
    });

    it('providers should work without error.', inject([MapperService], (mapper: MapperService) => {
        expect(mapper).toBeDefined();
    }));

    it('should use default injected logger.', inject([MapperService], (mapper: MapperService) => {
        expect(mapper["log"]).toBe(console);
    }));
});

describe('SimpleMapperModule with user logger', () => {
    class MockConsole {
        error(message?: any, ...optional: any[]): void { }
        log(message?: any, ...optional: any[]): void { }
        warn(message?: any, ...optional: any[]): void { }
        info(message?: any, ...optional: any[]): void { }
    }
    let mockCon = new MockConsole();
    beforeEach(() => {
        let config = <IConfig>{
            viewModels: vm
        };
        let providers = SimpleMapperModule.forRoot(config).providers
        providers.push({ provide: MapperLoggerToken, useValue: mockCon })
        TestBed.configureTestingModule({
            providers: providers
        });
    });

    it('should use user-injected logger.', inject([MapperService], (mapper: MapperService) => {
        expect(mapper["log"]).toBe(mockCon);
    }));
});
