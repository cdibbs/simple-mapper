/* tslint:disable:no-unused-variable */
import { ClassProvider } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { MapperService } from './mapper.service';
import { LogServiceToken } from '.';
import { BaseViewModel } from '../view-models';
import { mappable, getMappableProperties } from '../decorators';
import { MockLogService } from './mock';
import { Observable } from 'rxjs';

describe('MapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          MapperService,
          <ClassProvider>{ provide: LogServiceToken, useClass: MockLogService }
      ]
    });
  });

  it('should create.', inject([MapperService], (mapper: MapperService) => {
    expect(mapper).toBeTruthy();
  }));

  describe('MapJsonToVM', () =>  {
    it('should map basic primities.', inject([MapperService], (mapper: MapperService) => {
        class Mine extends BaseViewModel {
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
        var result = mapper.MapJsonToVM(Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result.Two).toBe(json.Two);
        expect(result.Three).toBe(json.Three);
    }));
    it('should ignore extraneous source properties when unmappedWarning is false.',
    inject([MapperService], (mapper: MapperService) => {
        var warned = null;
        mapper["log"].warn = function(yep) { warned = yep; };
        class Mine extends BaseViewModel {
            One: string = "string";
        }
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53, // ignored
        };
        var result = mapper.MapJsonToVM(Mine, json, false);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result["Two"]).toBeUndefined();
        expect(warned).toBeNull();
    }));
    it('should ignore extraneous source properties when unmappedWarning is false.',
    inject([MapperService], (mapper: MapperService) => {
        var warned = null;
        mapper["log"].warn = function(yep) { warned = yep; };
        class Mine extends BaseViewModel {
            One: string = "string";
        }
        var json = {
            Id: 3,
            One: "something else",
            Two: 6.53, // ignored
        };
        var result = mapper.MapJsonToVM(Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result["Two"]).toBeUndefined();
        expect(warned).toBeTruthy();
    }));
    it('should map nested types.', inject([MapperService], (mapper: MapperService) => {
        class MineTwo extends BaseViewModel {
            Another: string = "for me";
            get Computed(): string { return this.Another + " and me" };
        }
        class Mine extends BaseViewModel {
            One: string = "string";
            @mappable("MineTwo")
            Prop: MineTwo = null;
        }
        var json = {
            Id: 3,
            One: "something else",
            Prop: {
                Another: "for you"
            }
        };
        var result = mapper.MapJsonToVM(Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result.Prop).toBeDefined();
        expect(result.Prop.Another).toBe(json.Prop.Another);
        expect(result.Prop.Computed).toBe("for you and me");
    }));

    it('should map nested types under an observable.', inject([MapperService], (mapper: MapperService) => {
        class MineTwo extends BaseViewModel {
            Another: string = "for me";
            get Computed(): string { return this.Another + " and me" };
        }
        class Mine extends BaseViewModel {
            One: string = "string";
            @mappable("MineTwo")
            Prop: MineTwo = null;
        }
        var json = {
            Id: 3,
            One: "something else",
            Prop: {
                Another: "for you"
            }
        };
        Observable.from([json]).delay(100).subscribe(j => {
            var result = mapper.MapJsonToVM(Mine, json);
            expect(result.Id).toBe(3);
            expect(result.One).toBe(json.One);
            expect(result.Prop).toBeDefined();
            expect(result.Prop.Another).toBe(json.Prop.Another);
            expect(result.Prop.Computed).toBe("for you and me");
        });
    }));
    it('should map nested array types.', inject([MapperService], (mapper: MapperService) => {
        class MineTwo extends BaseViewModel {
            Another: string = "for me";
            get Computed(): string { return this.Another + " and me" };
        }
        class Mine extends BaseViewModel {
            One: string = "string";
            @mappable("MineTwo")
            Props: MineTwo[] = null;
        }
        var json = {
            Id: 3,
            One: "something else",
            Props: [{
                Another: "for you"
            }, {
                Another: "for me"
            }]
        };
        var result = mapper.MapJsonToVM(Mine, json);
        expect(result.Id).toBe(3);
        expect(result.One).toBe(json.One);
        expect(result.Props).toBeDefined();
        expect(result.Props.length).toBe(2);
        expect(result.Props[0].Computed).toBe("for you and me");
        expect(result.Props[1].Computed).toBe("for me and me");
    }));
  });
});
