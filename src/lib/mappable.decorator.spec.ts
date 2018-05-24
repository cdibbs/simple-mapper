/* tslint:disable:no-unused-variable */
import { Test, TestCase, TestFixture } from 'alsatian';
import { Assert, MatchMode } from "alsatian-fluent-assertions";
import * as vm from '../spec-lib/mappable.decorator.test-vms';
import { getMappableProperties, mappable } from './mappable.decorator';

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

            Assert(expectable).equals(expected);
        } catch(ex) {
            Assert(ex).has({ message: new RegExp(expected) });
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
        Assert(dict).isDefined();
        Assert(Object.keys(dict).length).equals(entries);
    }

    @Test("should not return other class's mappables.")
    public onlyOwnMappables() {
        let dict = getMappableProperties(vm.OnlyMineB);
        Assert(dict)
            .isDefined()
            .has({ Prop1: vm.OnlyMineA }, MatchMode.literal);
        Assert(Object.keys(dict).length).equals(1);
    }

    @Test("should return dict with prop names as keys, and model constructables as values")
    public validMappableDictFormat() {
        let dict = getMappableProperties(vm.MineWithTwo);
        Assert(dict)
            .isDefined()
            .has({
                Prop1: vm.Mine,
                Prop2: vm.UnheardOf
            },  MatchMode.literal)
        Assert(Object.keys(dict).length).equals(2);
    }
}