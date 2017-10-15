import { IMapperService, ILogService, IConfig } from './i';
import { getMappableProperties } from './mappable.decorator';

export class MapperService implements IMapperService {
    private models: { [key: string]: any };
    private noUnmappedWarnings: boolean;

    public constructor(
        private config: IConfig = {},
        private log: ILogService = console
    )
    {
        this.models = config.models || {};
        this.noUnmappedWarnings = !!config.noUnmappedWarnings;
        if (config.validateOnStartup) {
            this.validate();
        }
    }

    /**
     * Recursively maps object into a model. Uses @mappable attribute on destination model to determine
     * whether and how to map related models.
     * @param {instantiable} t The constructable destination view model.
     * @param {any} obj The source object.
     * @param {boolean} unmappedWarning Whether to warn if a destination property does not exist. Default: true.
     * @return {T} The constructed view model with all of its properties mapped from the source object.
     * @example map(UserModel, userObj);
     */
    public map<T extends { [key: string]: any }>(t: { new (): T }, obj: any, unmappedWarning: boolean = true): T {
        if (obj === null || obj === undefined) {
            return obj;
        }
        
        let vm = new t();
        let tprops = getMappableProperties(vm);
        let keys = Object.keys(obj);

        if (unmappedWarning === true || (unmappedWarning === undefined && ! this.noUnmappedWarnings)) {
            let t2props = Object.keys(vm);
            let unmapped = keys.filter(k => Object.keys(tprops).indexOf(k) < 0 && t2props.indexOf(k) < 0);
            if (unmapped.length)
                this.log.warn(`Unmapped source properties: ` + unmapped.join(", "));
        }

        for(var prop of keys) {
            let desc = Object.getOwnPropertyDescriptor(vm, prop);
            if (desc && !desc.writable)
                continue;
            // If there is an explicit mappable, map no matter what.
            if (typeof tprops[prop] === "string") {
                let p: string = <string>tprops[prop];
                if (! this.models.hasOwnProperty(p))
                {
                    throw new Error(`View model ${tprops[prop]} does not exist. Did you type it correctly?`);
                }

                // If both the source and the destination is iterable, map as an iterable.
                // We could fail on mismatch, but let's prefer versatility, given how APIs
                // often work.
                if (this.iterable(vm, obj, prop)) {
                    vm[prop] = this.mapArray(this.models[p], obj[prop]);
                } else {
                    vm[prop] = this.map(this.models[p], obj[prop]);
                }
            } else if (typeof tprops[prop] === 'function') {

                let p: { new(): any } = <{new():any}>tprops[prop];
                if (this.iterable(vm, obj, prop)) {
                    vm[prop] = this.mapArray(p, obj[prop]);
                } else {
                    vm[prop] = this.map(p, obj[prop]);
                }
            } else if (typeof vm[prop] !== "undefined") {
                vm[prop] = obj[prop];
            }
        }

        return vm;
    }

    /** determines whether the source object and destination view model property is iterable. */
    private iterable<T extends { [key: string]: any }>(vm: T, obj: any, prop: string): boolean {
        return !!((vm[prop] && typeof vm[prop][Symbol.iterator] === 'function')
                && (obj[prop] && typeof obj[prop][Symbol.iterator] === 'function'));
    }

    /**
     * Recursively maps an object array to a model array. Uses @mappable attribute on destination model to determine
     * whether and how to map nested models.
     * @param {instantiable} t The constructable destination model.
     * @param {any[]} objArr The source object array.
     * @param {boolean} unmappedWarning Whether to warn if a destination property does not exist. Default: true.
     * @return {T[]} The constructed model array with all of its member properties mapped from the source object.
     * @example mapArray(UserModel, userObjectArray, false);
     */
    public mapArray<T>(t: { new (): T }, objArr: any[], unmappedWarning = true): T[] {
        let arr = <T[]>[];
        for(var i=0; i<objArr.length; i++) {
            arr.push(this.map(t, objArr[i], unmappedWarning));
        }

        return arr;
    }

    public validate(): void {
        let errors: any[] = [];
        for(var key in this.models) {
            let tprops = getMappableProperties(this.models[key]);
            for(var p in tprops) {
                if (typeof tprops[p] === 'string' && !this.models.hasOwnProperty(<string>tprops[p])) {
                    errors.push(`${p} on ${key}: ${tprops[p]}`);
                }
            }
        }
        if (errors.length) {
            let missing: string = errors.join('\n');
            throw new Error(`Invalid configuration. The following view models are missing:\n ${missing}`);
        }
    }
}