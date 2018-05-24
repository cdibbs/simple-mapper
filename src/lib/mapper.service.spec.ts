/* tslint:disable:no-unused-variable */
import { Test, TestCase, TestFixture } from 'alsatian';
import { Assert, MatchMode } from 'alsatian-fluent-assertions';
import * as vm from '../spec-lib/view-models';
import { IConfig } from './i';
import { MapperService } from './mapper.service';

@TestFixture("MapperService constructor")
export class MapperServiceConstructorTests {
    @Test("should create.")
    public shouldCreate(): void {
        let config = <IConfig>{
            models: vm
        };
        let ms = new MapperService(config, console);
        Assert(ms).not.isNull();
    }

    @Test("should permit empty constructor")
    public shouldPermitEmptyConstructor() {
        let ms = new MapperService();
        const a = Assert(ms);
        a.has(<any>"config").that.deeplyEquals({});
        a.has(<any>"log").that.deeplyEquals(console);
    }

    @Test('should permit no config values (no throws).')
    public shouldPermitEmptyConfig(): void {
        let ms = new MapperService({}, console);
        Assert(ms["log"]).isDefined();
        Assert(ms["models"]).isTruthy();
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
        Assert(called).equals(shouldCall);
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

        Assert(() => mapper.validate()).maybe(throws).throws();
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
        Assert(result)
            .has({
                Id: 3,
                One: json.One,
                Two: json.Two,
                Three: json.Three
            }, MatchMode.literal);
    }

    @TestCase(false, true, true)
    @TestCase(true, false, false)
    @TestCase(true, true, true) // method setting overrides global setting
    @TestCase(false, false, false) // global setting does not override method setting
    @TestCase(undefined, undefined, true) // User never specified
    @TestCase(false, undefined, false)
    @TestCase(true, undefined, true)
    @TestCase(false, null, false)
    @TestCase(null, null, false) // Meh, they specified something falsy
    @Test('map should optionally warn of extraneous properties.')
    public map_ExtraProps_WarnsWhenAppropriate(
        globalNoWarnPref: boolean,
        warnPref: boolean,
        warnResult: boolean)
    {
        var warned = false;
        let mapper = new MapperService({ unmappedWarnings: globalNoWarnPref }, this.dummyConsole);
        mapper["log"].warn = function(yep) { warned = true; };
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53, // ignored
        };
        var result = mapper.map(vm.MineMinusTwo, json, warnPref);
        Assert(warned).equals(warnResult);
    }

    @TestCase(false, true, true)
    @TestCase(true, false, false)
    @TestCase(true, true, true) // method setting overrides global setting
    @TestCase(false, false, false) // global setting does not override method setting
    @TestCase(undefined, undefined, true) // User never specified
    @TestCase(false, undefined, false)
    @TestCase(true, undefined, true)
    @TestCase(false, null, false)
    @TestCase(null, null, false) // Meh, they specified something falsy
    @Test('mapArray should optionally warn of extraneous properties.')
    public mapArray_ExtraProps_WarnsWhenAppropriate(
        globalNoWarnPref: boolean,
        warnPref: boolean,
        warnResult: boolean)
    {
        var warned = false;
        let mapper = new MapperService({ unmappedWarnings: globalNoWarnPref }, this.dummyConsole);
        mapper["log"].warn = function(yep) { warned = true; };
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53, // ignored
        };
        var result = mapper.mapArray(vm.MineMinusTwo, [json], warnPref);
        Assert(warned).equals(warnResult);
    }

    @TestCase(null)
    @TestCase(undefined)
    @Test('map should return null or undefined when so input.')
    public map_NullYieldsNull(input: any) {
        let mapper = new MapperService({}, this.dummyConsole);
        let result = mapper.map(vm.Mine, input);
        Assert(result).equals(input);
    }

    @Test("should error when nested model missing.")
    public map_errorsOnMissingModel() {
        var json = {
            Id: 3,
            Prop: "something"
        };
        let mapper = new MapperService({}, this.dummyConsole);
        Assert(() => mapper.map(vm.NestedTypo, json))
            .throws();
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
        Assert(result)
            .hasAsserts({
                Id: 3,
                One: a => a.equals(json.One),
                Prop: {
                    Another: json.Prop.Another,
                    Computed: "for you and me"
                }
            });
    }

    @Test("should map nested reference types.")
    public map_shouldMapNestedReference() {
        var json = {
            Id: 3,
            Two: { Name: "something" }
        };
        let mapper = new MapperService({ models: vm }, this.dummyConsole);
        var result = mapper.map(vm.ByRefNested, json);
        Assert(result)
            .has({
                Id: 3,
                Two: {
                    Name: json.Two.Name,
                    Calculated: "something else"
                }
            });
    }

    @Test("should map nested array reference types.")
    public map_shouldMapNestedArrayReference() {
        var json = {
            Id: 3,
            Two: [{ Name: "something" }]
        };
        let mapper = new MapperService({ models: vm }, this.dummyConsole);
        var result = mapper.map(vm.ByRefNestedArray, json);
        Assert(result)
            .has({
                Id: 3,
                Two: [
                    {
                        Name: json.Two[0].Name,
                        Calculated: "something else"
                    }
                ]
            });
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
        Assert(result)
            .has({
                Id: 3,
                One: json.One,
                Props: [
                    { Computed: "for you and me" },
                    { Computed: "for me and me" }
                ]
            });
    }

    @TestCase(vm.ByRefNestedArray, "Two", { Two: {} }, false)
    @TestCase(vm.ByRefNested, "Two", { Two: {} }, false)
    @TestCase(vm.ByRefNestedArray, "Two",{ Two: [] }, true)
    @TestCase(vm.ByRefNested, "Two", { Two: [] }, false)
    @TestCase(vm.ByRefNestedArray, "Two", { Two: 234 }, false)
    @TestCase(vm.ByRefNested, "Two", { Two: 234 }, false)
    @TestCase(vm.ByRefNestedArray, "Two", { Two: "astring" }, true /* strings have iterators! */)
    @TestCase(vm.ByRefNested, "Two", { Two: "astring" }, false)
    @TestCase(vm.ByRefNestedArray, "Two", { Two: false }, false)
    @TestCase(vm.ByRefNested, "Two", { Two: false }, false)
    @Test("iterable correctly detects whether object is iterable.")
    public iterable_trueIffIterable(t: { new(): any }, prop: string, obj: any, expected: boolean) {
        let mapper = new MapperService();
        let inst = new t();
        Assert(mapper["iterable"](inst, obj, prop)).equals(expected);
    }

    @Test("map should ignore errors in attribute.")
    public map_TypoedAttribIgnored() {
        let mapper = new MapperService();
        Assert(mapper.map(vm.WeirdModel, { blarg: true }))
            .not.has((o: any) => o.blarg);
    }

    @Test("map should ignore unwritable properties.")
    public map_UnwritableIgnored() {
        const mapper = new MapperService();
        const result = mapper.map(vm.Unwritable, { unwritableProp: "change" });
        Assert(result)
            .has(o => o.unwritableProp).that.equals("can't change this");
    }
}