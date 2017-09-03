/* tslint:disable:no-unused-variable */
import { Expect, Test, TestFixture, TestCase, SpyOn, Setup, Teardown } from 'alsatian';
import { Observable } from 'rxjs';

import { MapperService } from './mapper.service';
import { mappable, getMappableProperties } from './mappable.decorator';
import * as vm from '../spec-lib/mappable.decorator.test-vms';
import { IConfig } from './i';

@TestFixture("Mappable decorator tests")
export class MappableDecoratorTests {

    @TestCase(undefined, "", "Provided type for property")
    @TestCase(vm.Mine, "Should not throw when defined", "Should not throw when defined")
    @Test("should throw when mappable given undefined type.")
    public undefinedTypeThrows(type: any, expectable: string, expected: string) {
        try {
            class ByRefOutOfOrder {
                Id: number = 3;
                @mappable(type)
                Two: ByRefOutOfOrder = null;
            }

            Expect(expectable).toBe(expected);
        } catch(ex) {
            Expect(ex.message.substr(0, expected.length)).toBe(expected);
        }
    }
}

@TestFixture("getMappableProperties tests")
export class GetMappablePropertiesTests {

    @TestCase(vm.UnheardOf, 0)
    @TestCase(vm.Mine, 1)
    @TestCase(vm.MineWithTwo, 2)
    @Test("should return a dictionary of mappables.")
    public returnDict(type: any, entries: number) {
        let dict = getMappableProperties(type);
        Expect(dict).toBeDefined();
        Expect(Object.keys(dict).length).toBe(entries);
    }

    @Test("should not return other class's mappables.")
    public onlyOwnMappables() {
        let dict = getMappableProperties(vm.OnlyMineB);
        Expect(dict).toBeDefined();
        Expect(Object.keys(dict).length).toBe(1);
        Expect(dict["Prop1"]).toBe(vm.OnlyMineA);
    }

    @Test("should return dict with prop names as keys, and model constructables as values")
    public validMappableDictFormat() {
        let dict = getMappableProperties(vm.MineWithTwo);
        Expect(dict).toBeDefined();
        Expect(Object.keys(dict).length).toBe(2);
        Expect(dict["Prop1"]).toBe(vm.Mine);
        Expect(dict["Prop2"]).toBe(vm.UnheardOf);
    }
}