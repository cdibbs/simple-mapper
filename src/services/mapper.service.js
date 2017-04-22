var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { InjectionToken, Inject, Injectable } from '@angular/core';
import { LoggerToken } from './i';
import { getMappableProperties } from '../decorators/mappable.decorator';
export var MapperServiceToken = new InjectionToken("IMapperServiceToken");
export var ViewModelCollection = new InjectionToken("ViewModelCollection");
export var LogService = new InjectionToken("ILogService");
export var MapperConfiguration = new InjectionToken("MapperConfiguration");
var MapperService = (function () {
    function MapperService(config, log) {
        this.config = config;
        this.log = log;
        this.viewModels = config.viewModels || {};
        this.noUnmappedWarnings = !!config.noUnmappedWarnings;
        if (config.validateOnStartup) {
            this.validate();
        }
    }
    /** Recursively maps JSON into a ViewModel. This is required in order to get the ViewModel's methods.
     * Typecasting is not sufficient. Uses @mappable attribute on destination ViewModel to determine
     * whether and how to map related ViewModels.
     * @param {instantiable} t The constructable destination view model.
     * @param {any} json The source JSON object.
     * @param {boolean} unmappedWarning Whether to warn if a destination property does not exist. Default: true.
     * @return {T} The constructed view model with all of its properties mapped from the source json.
     * @example MapJsonToVM(UserViewModel, userJson);
     */
    MapperService.prototype.MapJsonToVM = function (t, json, unmappedWarning) {
        if (unmappedWarning === void 0) { unmappedWarning = undefined; }
        var vm = new t();
        var tprops = getMappableProperties(vm);
        var keys = Object.keys(json || {});
        if (unmappedWarning === true || (unmappedWarning === undefined && !this.noUnmappedWarnings)) {
            var t2props_1 = Object.keys(vm);
            var unmapped = keys.filter(function (k) { return Object.keys(tprops).indexOf(k) < 0 && t2props_1.indexOf(k) < 0; });
            if (unmapped.length)
                this.log.warn("Unmapped source properties: " + unmapped.join(", "));
        }
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var prop = keys_1[_i];
            var desc = Object.getOwnPropertyDescriptor(vm, prop);
            if (!desc || !desc.writable)
                continue;
            // If there is an explicit mappable, map no matter what.
            if (typeof tprops[prop] === "string") {
                var p = tprops[prop];
                if (!this.viewModels.hasOwnProperty(p))
                    throw new Error("View model " + tprops[prop] + " does not exist. Did you type it correctly?");
                // If either the source or destination is iterable,
                // map as an iterable. This is not ideal, but neither
                // is Typescript. :-P
                if (this.iterable(vm, json, prop)) {
                    vm[prop] = this.MapJsonToVMArray(this.viewModels[p], json[prop]);
                }
                else {
                    vm[prop] = this.MapJsonToVM(this.viewModels[p], json[prop]);
                }
            }
            else if (typeof tprops[prop] === 'function') {
                var p = tprops[prop];
                if (this.iterable(vm, json, prop)) {
                    vm[prop] = this.MapJsonToVMArray(p, json[prop]);
                }
                else {
                    vm[prop] = this.MapJsonToVM(p, json[prop]);
                }
            }
            else if (typeof vm[prop] !== "undefined") {
                vm[prop] = json[prop];
            }
        }
        return vm;
    };
    /** determines whether either the source json or destination view model property is iterable. */
    MapperService.prototype.iterable = function (vm, json, prop) {
        return (vm[prop] && typeof vm[prop][Symbol.iterator] === 'function')
            || (json[prop] && typeof json[prop][Symbol.iterator] === 'function');
    };
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
    MapperService.prototype.MapJsonToVMArray = function (t, json, unmappedWarning) {
        if (unmappedWarning === void 0) { unmappedWarning = true; }
        var arr = [];
        for (var i = 0; i < json.length; i++) {
            arr.push(this.MapJsonToVM(t, json[i], unmappedWarning));
        }
        return arr;
    };
    MapperService.prototype.validate = function () {
        var errors = [];
        for (var key in this.viewModels) {
            var tprops = getMappableProperties(this.viewModels[key]);
            for (var p in tprops) {
                if (typeof tprops[p] === 'string' && !this.viewModels.hasOwnProperty(tprops[p])) {
                    errors.push(p + " on " + key + ": " + tprops[p]);
                }
            }
        }
        if (errors.length) {
            var missing = errors.join('\n');
            throw new Error("Invalid configuration. The following view models are missing:\n " + missing);
        }
    };
    return MapperService;
}());
MapperService = __decorate([
    Injectable(),
    __param(0, Inject(MapperConfiguration)),
    __param(1, Inject(LoggerToken))
], MapperService);
export { MapperService };
//# sourceMappingURL=mapper.service.js.map