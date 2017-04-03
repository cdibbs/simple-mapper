/* tslint:disable:no-unused-variable */
import { ClassProvider, ValueProvider } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { MapperService, MapperConfiguration} from './mapper.service';
import { mappable, getMappableProperties } from '../decorators/mappable.decorator';
import * as vm from '../test-resources/view-models';
import { IConfig } from './i';

describe('MapperService', () => {
  beforeEach(() => {
    let config = <IConfig>{
        logger: console,
        viewModels: vm
    };
    TestBed.configureTestingModule({
        providers: [
            MapperService,
            <ValueProvider>{ provide: MapperConfiguration, useValue: config }
        ]
    });
  });

  it('should create.', inject([MapperService], (mapper: MapperService) => {
    expect(mapper).toBeTruthy();
  }));

  it('should permit no config values (no throws).', () => {
    let ms = new MapperService({});
    expect(ms["log"]).toBeDefined();
    expect(ms["viewModels"]).toBeTruthy();
  });

  it('should not validate by default.', () => {
    let called: boolean = false;
    class Mapper2 extends MapperService {
        validate(): void {
            called = true;
        }
    }

    let m = new Mapper2({});
    expect(called).toBeFalsy();    
  });

  it('should validate when provoked.', () => {
    let called: boolean = false;
    class Mapper2 extends MapperService {
        validate(): void {
            called = true;
        }
    }

    let m = new Mapper2({ validateOnStartup: true });
    expect(called).toBeTruthy();    
  });

  describe('validate', () => {
    it("doesn't throw when @mappable names are valid.", inject([MapperService], (mapper: MapperService) => {
        class Mine {
            Id: number = 3;
        }
        class Mine2 {
            Name: string = "";
            @mappable("Mine")
            Mine: Mine = null;
        }
        
        mapper["viewModels"] = { "Mine": Mine, "Mine2": Mine2 };
        mapper.validate();
    }));
    it("throws when a @mappable doesn't exist (typoes).", inject([MapperService], (mapper: MapperService) => {
        class Mine {
            Id: number = 3;
        }
        class Mine2 {
            Name: string = "";
            @mappable("ATypoFromMeToYou")
            Mine: Mine = null;
        }
        
        mapper["viewModels"] = { "Mine": Mine, "Mine2": Mine2 };
        try {
            mapper.validate();
            expect("").toBe("Should have thrown an error.");
        } catch (err) {
            expect(err).toBeDefined();
        }
    }));
  });

  describe('MapJsonToVM', () =>  {
    it('should map basic primitives.', inject([MapperService], (mapper: MapperService) => {
        class Mine {
            Id: number = 3;
            One: string = "string";
            Two: number = 3.14;
            Three: string = null;
        }
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53,
            Three: "another"
        };
        var result = mapper.MapJsonToVM(vm.Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result.Two).toBe(json.Two);
        expect(result.Three).toBe(json.Three);
    }));
    it('should ignore extraneous source properties when unmappedWarning is false.',
    inject([MapperService], (mapper: MapperService) => {
        var warned = null;
        mapper["log"].warn = function(yep) { warned = yep; };
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53, // ignored
        };
        var result = mapper.MapJsonToVM(vm.MineMinusTwo, json, false);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result["Two"]).toBeUndefined();
        expect(warned).toBeNull();
    }));
    it('should warn when extraneous source properties.',
    inject([MapperService], (mapper: MapperService) => {
        var warned = null;
        mapper["log"].warn = function(yep) { warned = yep; };
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53, // ignored
        };
        var result = mapper.MapJsonToVM(vm.MineMinusTwo, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result["Two"]).toBeUndefined();
        expect(warned).toBeTruthy();
    }));
    it('should not warn when not extraneous source properties.',
    inject([MapperService], (mapper: MapperService) => {
        var warned = null;
        mapper["log"].warn = function(yep) { warned = yep; };
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53, // ignored
        };
        var result = mapper.MapJsonToVM(vm.Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(warned).toBeFalsy();
    }));
    it('should error when view model missing.',
    inject([MapperService], (mapper: MapperService) => {
        try {
            var json = {
                Id: 3,
                Prop: "something"
            };
            var result = mapper.MapJsonToVM(vm.NestedTypo, json);
            expect("").toBe("Should have thrown error before here");
        } catch(err) {
            expect(err).toBeTruthy();
        }
    }));
    it('should map nested types.', inject([MapperService], (mapper: MapperService) => {
        var json = {
            Id: 3,
            One: "something else",
            Prop: {
                Another: "for you"
            }
        };
        var result = mapper.MapJsonToVM(vm.Nested_Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result.Prop).toBeDefined();
        expect(result.Prop.Another).toBe(json.Prop.Another);
        expect(result.Prop.Computed).toBe("for you and me");
    }));
    it('should map nested reference types.', inject([MapperService], (mapper: MapperService) => {
        var json = {
            Id: 3,
            Two: { Name: "something" }
        };
        var result = mapper.MapJsonToVM(vm.ByRefNested, json);
        expect(result.Id).toBe(3);
        expect(result.Two).toBeDefined();
        expect(result.Two.Name).toBe(json.Two.Name);
        expect(result.Two.Calculated).toBe("something else");
    }));
    it('should map nested array reference types.', inject([MapperService], (mapper: MapperService) => {
        var json = {
            Id: 3,
            Two: [{ Name: "something" }]
        };
        var result = mapper.MapJsonToVM(vm.ByRefNestedArray, json);
        expect(result.Id).toBe(3);
        expect(result.Two).toBeDefined();
        expect(result.Two[0].Name).toBe(json.Two[0].Name);
        expect(result.Two[0].Calculated).toBe("something else");
    }));
    it('should map nested types under an observable.', async(inject([MapperService], (mapper: MapperService) => {
        var json = {
            Id: 3,
            One: "something else",
            Prop: {
                Another: "for you"
            }
        };
        Observable.from([json]).delay(100).subscribe(j => {
            var result = mapper.MapJsonToVM(vm.Observable_Mine, json);
            expect(result.Id).toBe(3);
            expect(result.One).toBe(json.One);
            expect(result.Prop).toBeDefined();
            expect(result.Prop.Another).toBe(json.Prop.Another);
            expect(result.Prop.Computed).toBe("for you and me");
        });
    })));
    it('should map nested reference types under an observable.', async(inject([MapperService], (mapper: MapperService) => {
        var json = {
            Id: 3,
            Two: { Name: "something" },
        };
        Observable.from([json]).delay(100).subscribe(j => {
            var result = mapper.MapJsonToVM(vm.ByRefNested, json);
            expect(result.Id).toBe(3);
            expect(result.Two).toBeTruthy();
            expect(result.Two.Name).toBe("something");
            expect(result.Two.Calculated).toBe("something else");
        });
    })));
    it('should map nested array types.', inject([MapperService], (mapper: MapperService) => {
        var json = {
            Id: 3,
            One: "something else",
            Props: [{
                Another: "for you"
            }, {
                Another: "for me"
            }]
        };
        var result = mapper.MapJsonToVM(vm.NestedArrayTypes_Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result.Props).toBeDefined();
        expect(result.Props.length).toBe(2);
        expect(result.Props[0].Computed).toBe("for you and me");
        expect(result.Props[1].Computed).toBe("for me and me");
    }));
  });
});