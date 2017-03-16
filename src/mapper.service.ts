import { OpaqueToken, Inject, Injectable } from '@angular/core';
import { IMapperService, ILogService } from './i';
import { getMappableProperties } from './decorators/mappable.decorator';

@Injectable()
export class MapperService implements IMapperService {
    public constructor(
        private viewModels: { [key: string]: any } = {},
        private log: ILogService = console
    ) { }

    /** Recursively maps JSON into a ViewModel. This is required in order to get the ViewModel's methods.
     * Typecasting is not sufficient. Uses @mappable attribute on destination ViewModel to determine
     * whether and how to map related ViewModels.
     * @param {instantiable} t The constructable destination view model.
     * @param {any} json The source JSON object.
     * @param {boolean} unmappedWarning Whether to warn if a destination property does not exist. Default: true.
     * @return {T} The constructed view model with all of its properties mapped from the source json.
     * @example MapJsonToVM(UserViewModel, userJson);
     */
    public MapJsonToVM<T extends { [key: string]: any }>(t: { new (): T }, json: any, unmappedWarning = true): T {
        let vm = new t();
        var tprops = getMappableProperties<T>(vm);
        //console.log(tprops);
        for(var prop of Object.keys(json || {})) {
            let desc = Object.getOwnPropertyDescriptor(vm, prop);
            if (!desc || !desc.writable)
                continue;

            // If their is an explicit mappable, map no matter what.
            if (typeof tprops[prop] === "string") {
                if (! this.viewModels.hasOwnProperty(tprops[prop]))
                    this.log.warn(`View model ${tprops[prop]} does not exist. Did you type it correctly?`);
                // If either the source or destination is iterable,
                // map as an iterable. This is not ideal, but neither
                // is Typescript. :-P
                if (this.iterable(vm, json, prop)) {
                    vm[prop] = this.MapJsonToVMArray(this.viewModels[tprops[prop]], json[prop]);
                } else {
                    vm[prop] = this.MapJsonToVM(this.viewModels[tprops[prop]], json[prop]);
                }
            }
            else if (typeof vm[prop] !== "undefined") {
                vm[prop] = json[prop];
            }
            else if (unmappedWarning) {
                this.log.warn(`Property ${prop} is not mapped. Are you missing a destination property, default value, or @mappable attribute?`);
            }
        }

        return vm;
    }

    /** determines whether either the source json or destination view model property is iterable. */
    private iterable<T extends { [key: string]: any }>(vm: T, json: any, prop: string): boolean {
        return (vm[prop] && typeof vm[prop][Symbol.iterator] === 'function')
                || (json[prop] && typeof json[prop][Symbol.iterator] === 'function');
    }

    /**
     * Recursively maps a JSON array to a ViewModel array. This is required in order to get the ViewModel's
     * methods. Typecasting is not sufficient. Uses @mappable attribute on destination ViewModel to determine
     * whether and how to map related ViewModels.
     * @param {instantiable} t The constructable destination view model.
     * @param {any[]} json The source JSON array.
     * @param {boolean} unmappedWarning Whether to warn if a destination property does not exist. Default: true.
     * @return {T[]} The constructed view model array with all of its member properties mapped from the source json.
     * @example MapJsonToVM(UserViewModel, userJson);
     */
    public MapJsonToVMArray<T>(t: { new (): T }, json: any[]): T[] {
        let arr = <T[]>[];
        for(var i=0; i<json.length; i++) {
            arr.push(this.MapJsonToVM(t, json[i]));
        }

        return arr;
    }
}

export let MapperServiceToken = new OpaqueToken("IMapperServiceToken");