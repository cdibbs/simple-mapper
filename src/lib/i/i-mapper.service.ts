export interface IMapperService {
    /** Recursively maps an object into a model. Uses @mappable attribute on destination
     * model to determine whether and how to map related models.
     * @param {instantiable} t The constructable destination model.
     * @param {any} json The source JSON object.
     * @return {T} The constructed view model with all of its properties mapped from the source json.
     * @example MapJsonToVM(UserViewModel, userJson);
     */
    map<T>(t: { new (): T }, json: any): T;

    /**
     * Recursively maps a JSON array to a model array. Uses @mappable attribute on destination model to determine
     * whether and how to map related models. This will be called by map when given a JSON Array. You can also call
     * it explicitly.
     * @param {instantiable} t The new-able destination model.
     * @param {any[]} json The source JSON array.
     * @return {T[]} The constructed view model array with all of its member properties mapped from the source json.
     * @example MapJsonToVM(UserViewModel, userJson);
     */
    mapArray<T>(t: { new (): T }, json: any): T[];

    /**
     * Validates whether the configuration would produce valid mappings. Will error on, e.g.,
     * a typoed @mappable("TypoedName").
     */
    validate(): void;
}