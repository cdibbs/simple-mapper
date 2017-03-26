export interface IMapperService {
    /** Recursively maps JSON into a ViewModel. This is required in order to get the ViewModel's methods.
     * Typecasting is not sufficient. Uses @mappable attribute on destination ViewModel to determine
     * whether and how to map related ViewModels.
     * @param {instantiable} t The constructable destination view model.
     * @param {any} json The source JSON object.
     * @param {boolean} unmappedWarning Whether to warn if a destination property does not exist. Default: true.
     * @return {T} The constructed view model with all of its properties mapped from the source json.
     * @example MapJsonToVM(UserViewModel, userJson);
     */
    MapJsonToVM<T>(t: { new (): T }, json: any): T;

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
    MapJsonToVMArray<T>(t: { new (): T }, json: any): T[];
}