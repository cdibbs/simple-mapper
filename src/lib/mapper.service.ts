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

    /** Recursively maps JSON into a ViewModel. This is required in order to get the ViewModel's methods.
     * Typecasting is not sufficient. Uses @mappable attribute on destination ViewModel to determine
     * whether and how to map related models.
     * @param {instantiable} t The constructable destination view model.
     * @param {any} json The source JSON object.
     * @param {boolean} unmappedWarning Whether to warn if a destination property does not exist. Default: true.
     * @return {T} The constructed view model with all of its properties mapped from the source json.
     * @example MapJsonToVM(UserViewModel, userJson);
     */
    public map<T extends { [key: string]: any }>(t: { new (): T }, json: any, unmappedWarning: boolean = undefined): T {
        if (json === null || json === undefined) {
            return json;
        }
        
        let vm = new t();
        let tprops = getMappableProperties(vm);
        let keys = Object.keys(json);

        if (unmappedWarning === true || (unmappedWarning === undefined && ! this.noUnmappedWarnings)) {
            let t2props = Object.keys(vm);
            let unmapped = keys.filter(k => Object.keys(tprops).indexOf(k) < 0 && t2props.indexOf(k) < 0);
            if (unmapped.length)
                this.log.warn(`Unmapped source properties: ` + unmapped.join(", "));
        }

        for(var prop of keys) {
            let desc = Object.getOwnPropertyDescriptor(vm, prop);
            if (!desc || !desc.writable)
                continue;
            // If there is an explicit mappable, map no matter what.
            if (typeof tprops[prop] === "string") {
                let p: string = <string>tprops[prop];
                if (! this.models.hasOwnProperty(p))
                    throw new Error(`View model ${tprops[prop]} does not exist. Did you type it correctly?`);
                // If either the source or destination is iterable,
                // map as an iterable. This is not ideal, but neither
                // is Typescript. :-P
                if (this.iterable(vm, json, prop)) {
                    vm[prop] = this.mapArray(this.models[p], json[prop]);
                } else {
                    vm[prop] = this.map(this.models[p], json[prop]);
                }
            } else if (typeof tprops[prop] === 'function') {

                let p: { new(): any } = <{new():any}>tprops[prop];
                if (this.iterable(vm, json, prop)) {
                    vm[prop] = this.mapArray(p, json[prop]);
                } else {
                    vm[prop] = this.map(p, json[prop]);
                }
            } else if (typeof vm[prop] !== "undefined") {
                vm[prop] = json[prop];
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
     * Recursively maps a JSON array to a model array. This is required in order to use the model's
     * methods. Typecasting is not sufficient. Uses @mappable attribute on destination model to determine
     * whether and how to map nested models.
     * @param {instantiable} t The constructable destination model.
     * @param {any[]} json The source JSON array.
     * @param {boolean} unmappedWarning Whether to warn if a destination property does not exist. Default: true.
     * @return {T[]} The constructed model array with all of its member properties mapped from the source json.
     * @example mapArray(UserModel, userJsonArray, false);
     */
    public mapArray<T>(t: { new (): T }, json: any[], unmappedWarning = true): T[] {
        let arr = <T[]>[];
        for(var i=0; i<json.length; i++) {
            arr.push(this.map(t, json[i], unmappedWarning));
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