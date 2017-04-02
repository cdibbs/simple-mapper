/* tslint:disable:no-unused-variable */
import { ClassProvider, ValueProvider } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { MapperService, MapperConfiguration} from '../services/mapper.service';
import { mappable, getMappableProperties } from '../decorators/mappable.decorator';
import * as vm from '../test-resources/mappable.decorator.test-vms';
import { IConfig } from '../services/i';


describe('Mappable Decorator', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
            ]
        });
    });
    it('should not throw when ref types defined in order.', () => {
        class ByRefOutOfOrderTwo {
            Name: string = "";
            get Calculated(): string { return this.Name + " else"; }
        }
        class ByRefOutOfOrder {
            Id: number = 3;
            @mappable(ByRefOutOfOrderTwo)
            Two: ByRefOutOfOrder = null;
        }

        expect(1).toBe(1);
    });
    it('should throw when reference types defined out-of-order.', () => {
        try {
            class ByRefOutOfOrder {
                Id: number = 3;
                @mappable(ByRefOutOfOrderTwo)
                Two: ByRefOutOfOrder = null;
            }

            class ByRefOutOfOrderTwo {
                Name: string = "";
                get Calculated(): string { return this.Name + " else"; }
            }
            expect("").toBe("Should have thrown an error.");
        } catch (err) {
            expect(err).toBeDefined();
            expect(err.toString()).toContain("Did you define the type before using it?");
        }
    });
});

describe('getMappableProperties', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: "UnheardOf", useValue: vm.UnheardOf },
                { provide: "Mine", useValue: vm.Mine }
            ]
        });
    });
    it('should return an empty dictionary when no mappables configured.', inject([], () => {
        let dict = getMappableProperties(vm.UnheardOf);
        expect(dict).toBeDefined();
        expect(Object.keys(dict).length).toBe(0);
    }));
    it('should return a dictionary with one entry when class has one mappable.', inject([], () => {
        console.log("Here first, but shouldn't be.");
        console.log("Of interest", vm.Mine);
        let dict = getMappableProperties(vm.Mine);
        console.log(dict);
        expect(dict).toBeDefined();
        expect(Object.keys(dict).length).toBe(1);
        console.log(typeof dict["Prop"], typeof vm.UnheardOf);
        expect(dict["Prop"]).toBe(vm.UnheardOf);
    }));
    it('should not return other classes mappables.', inject([], () => {
        let dict = getMappableProperties(vm.UnheardOf);
        expect(dict).toBeDefined();
        expect(Object.keys(dict).length).toBe(0);
    }));
});
