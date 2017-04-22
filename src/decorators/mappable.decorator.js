var mapMetadataKey = "us.dibbern.oss.map.decorator";
export function mappable(type) {
    return function (target, propertyKey) {
        if (typeof type === "undefined") {
            throw new Error("Provided type for property \"" + propertyKey + "\" on \"" + target.constructor.name + "\" is undefined. Did you define the type before using it?");
        }
        var d = Reflect.get(target, mapMetadataKey) || {};
        d[propertyKey] = type;
        Reflect.set(target, mapMetadataKey, d);
    };
}
export function getMappableProperties(target) {
    if (typeof target === 'function') {
        target = target['prototype'];
    }
    return Reflect.get(target, mapMetadataKey) || {};
}
//# sourceMappingURL=mappable.decorator.js.map