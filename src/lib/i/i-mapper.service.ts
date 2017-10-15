export interface IMapperService {
    /**
     * Recursively maps object into a model. Uses @mappable attribute on destination model to determine
     * whether and how to map related models.
     * @param {instantiable} t The constructable destination view model.
     * @param {any} obj The source object.
     * @param {boolean} unmappedWarning Whether to warn if a destination property does not exist. Default: true.
     * @return {T} The constructed view model with all of its properties mapped from the source object.
     * @example map(UserModel, userObj);
     */
    map<T>(t: { new (): T }, json: any, unmappedWarning?: boolean): T;

    /**
     * Recursively maps an object array to a model array. Uses @mappable attribute on destination model to determine
     * whether and how to map nested models.
     * @param {instantiable} t The constructable destination model.
     * @param {any[]} objArr The source object array.
     * @param {boolean} unmappedWarning Whether to warn if a destination property does not exist. Default: true.
     * @return {T[]} The constructed model array with all of its member properties mapped from the source object.
     * @example mapArray(UserModel, userObjectArray, false);
     */
    mapArray<T>(t: { new (): T }, json: any, unmappedWarning?: boolean): T[];

    /**
     * Validates whether the configuration would produce valid mappings. Will error on, e.g.,
     * a typoed @mappable("TypoedName").
     */
    validate(): void;
}