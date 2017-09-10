/* tslint:disable:no-unused-variable */
import { Expect, Test, TestFixture, TestCase, SpyOn, Setup, Teardown } from 'alsatian';
import { Observable } from 'rxjs';

import { MapperService } from './mapper.service';
import { mappable, getMappableProperties } from './mappable.decorator';
import * as vm from '../spec-lib/view-models';
import { IConfig } from './i';

@TestFixture("MapperService constructor")
export class MapperServiceConstructorTests {
    @Test("should create.")
    public shouldCreate(): void {
        let config = <IConfig>{
            models: vm
        };
        let ms = new MapperService(config, console);
        Expect(ms).not.toBe(null);
    }

    @Test("should permit empty constructor")
    public shouldPermitEmptyConstructor() {
        let ms = new MapperService();
        Expect(ms["config"]).toEqual({});
        Expect(ms["log"]).toBe(console);
    }

    @Test('should permit no config values (no throws).')
    public shouldPermitEmptyConfig(): void {
        let ms = new MapperService({}, console);
        Expect(ms["log"]).toBeDefined();
        Expect(ms["models"]).toBeTruthy();
    }

    @TestCase({}, false)
    @TestCase({ validateOnStartup: true }, true)
    @Test("validates only when told.")
    public whenToValidate(config: any, shouldCall: boolean): void {
        let called = false;
        class MapperService2 extends MapperService {
            validate() {
                called = true;
            }
        }
        let m = new MapperService2(config, console);
        Expect(called).toBe(shouldCall);
    }
}

@TestFixture("MapperService")
export class MapperService_MethodTests {
    dummyConsole: Console = <any>{
        log: () => {},
        error: () => {},
        warn: () => {}
    };


    @TestCase(vm.ValidateTestClass2, false)
    @TestCase(vm.InvalidValidateTestClass, true)
    @Test("validate throws only when invalid.")
    public throwsOnlyWhenInvalid(testClass: new () => any, throws: boolean): void {
        let mapper = new MapperService({}, console);
        mapper["models"] = { "ValidateTestClass": vm.ValidateTestClass, "Mine2": testClass };
        try {
            mapper.validate();
            Expect(false).toBe(throws);
        } catch(ex) {
            Expect(true).toBe(throws);
        }
    }

    @Test('map should map primitives.')
    public mapMapsPrimitives() {
        class Mine {
            Id: number = 3;
            One: string = "string";
            Two: number = 3.14;
            Three: string = null;
        }
        let json = {
            Id: 3,
            One: "something else",
            Two: 6.53,
            Three: "another"
        };
        let mapper = new MapperService({}, this.dummyConsole);
        let result = mapper.map(vm.Mine, json);
        Expect(result.Id).toBe(3);
        Expect(result.One).toBe(json.One);
        Expect(result.Two).toBe(json.Two);
        Expect(result.Three).toBe(json.Three);
    }

    @TestCase(false, true, true)
    @TestCase(true, false, false)
    @TestCase(true, true, true) // method setting overrides global setting
    @TestCase(false, false, false) // global setting does not override method setting
    @TestCase(undefined, undefined, true) // User never specified
    @TestCase(false, undefined, true)
    @TestCase(true, undefined, false)
    @TestCase(false, null, false)
    @TestCase(null, null, false) // Meh, they specified something falsy
    @Test('map should optionally warn of extraneous properties.')
    public map_ExtraProps_WarnsWhenAppropriate(
        globalNoWarnPref: boolean,
        warnPref: boolean,
        warnResult: boolean)
    {
        var warned = false;
        let mapper = new MapperService({ noUnmappedWarnings: globalNoWarnPref }, this.dummyConsole);
        mapper["log"].warn = function(yep) { warned = true; };
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53, // ignored
        };
        var result = mapper.map(vm.MineMinusTwo, json, warnPref);
        Expect(warned).toBe(warnResult);
    }

    @TestCase(null)
    @TestCase(undefined)
    @Test('map should return null or undefined when so input.')
    public map_NullYieldsNull(input: any) {
        let mapper = new MapperService({}, this.dummyConsole);
        let result = mapper.map(vm.Mine, input);
        Expect(result).toBe(input);
    }

    @Test("should error when nested model missing.")
    public map_errorsOnMissingModel() {
        try {
            var json = {
                Id: 3,
                Prop: "something"
            };
            let mapper = new MapperService({}, this.dummyConsole);
            var result = mapper.map(vm.NestedTypo, json);
            Expect("").toBe("Should have thrown error before here");
        } catch(err) {
            Expect(err).toBeTruthy();
        }
    }

    @Test("should map nested types.")
    public map_shouldMapNested() {
                var json = {
            Id: 3,
            One: "something else",
            Prop: {
                Another: "for you"
            }
        };
        let mapper = new MapperService({ models: vm }, this.dummyConsole);
        var result = mapper.map(vm.Nested_Mine, json);
        Expect(result.Id).toBe(3);
        Expect(result.One).toBe(json.One);
        Expect(result.Prop).toBeDefined();
        Expect(result.Prop.Another).toBe(json.Prop.Another);
        Expect(result.Prop.Computed).toBe("for you and me");
    }

    @Test("should map nested reference types.")
    public map_shouldMapNestedReference() {
        var json = {
            Id: 3,
            Two: { Name: "something" }
        };
        let mapper = new MapperService({ models: vm }, this.dummyConsole);
        var result = mapper.map(vm.ByRefNested, json);
        Expect(result.Id).toBe(3);
        Expect(result.Two).toBeDefined();
        Expect(result.Two.Name).toBe(json.Two.Name);
        Expect(result.Two.Calculated).toBe("something else");
    }

    @Test("should map nested array reference types.")
    public map_shouldMapNestedArrayReference() {
        var json = {
            Id: 3,
            Two: [{ Name: "something" }]
        };
        let mapper = new MapperService({ models: vm }, this.dummyConsole);
        var result = mapper.map(vm.ByRefNestedArray, json);
        Expect(result.Id).toBe(3);
        Expect(result.Two).toBeDefined();
        Expect(result.Two[0].Name).toBe(json.Two[0].Name);
        Expect(result.Two[0].Calculated).toBe("something else");
    }

    @Test("should map nested array types.")
    public map_shouldMapNestedArrayTypes() {
        var json = {
            Id: 3,
            One: "something else",
            Props: [{
                Another: "for you"
            }, {
                Another: "for me"
            }]
        };
        let mapper = new MapperService({ models: vm }, this.dummyConsole);
        var result = mapper.map(vm.NestedArrayTypes_Mine, json);
        Expect(result.Id).toBe(3);
        Expect(result.One).toBe(json.One);
        Expect(result.Props).toBeDefined();
        Expect(result.Props.length).toBe(2);
        Expect(result.Props[0].Computed).toBe("for you and me");
        Expect(result.Props[1].Computed).toBe("for me and me");
    }
}
/*
  describe('MapJsonToVM', () =>  {
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
*/