import { URLSearchParams } from '@angular/http';

const mapMetadataKey = "us.dibbern.oss.map.decorator";
export type decoratorInput = { new(): any } | string;

export function mappable(type: decoratorInput)
{
    return function (target: Object, propertyKey: string | symbol) {
        if (typeof type === "undefined") {
            throw new Error(`Provided type for property "${propertyKey}" on "${target.constructor.name}" is undefined. Did you define the type before using it?`);
        }
        let d: { [propKey: string]: decoratorInput }
            = Reflect.get(target, mapMetadataKey) || {};
        d[propertyKey] = type;
        Reflect.set(target, mapMetadataKey, d);
    };
}

export function getMappableProperties(target: Object)
    : { [propKey : string]: decoratorInput }
{
    if (typeof target === 'function') {
        target = target['prototype'];
    }

    return Reflect.get(target, mapMetadataKey) || {};
}