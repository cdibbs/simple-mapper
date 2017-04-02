[![npm version](https://badge.fury.io/js/simple-mapper.svg)](https://badge.fury.io/js/simple-mapper)
[![Build Status](https://travis-ci.org/cdibbs/simple-mapper.svg?branch=master)](https://travis-ci.org/cdibbs/simple-mapper)
[![dependencies Status](https://david-dm.org/cdibbs/simple-mapper/status.svg)](https://david-dm.org/cdibbs/simple-mapper)
[![devDependencies Status](https://david-dm.org/cdibbs/simple-mapper/dev-status.svg)](https://david-dm.org/cdibbs/simple-mapper?type=dev)
[![codecov](https://codecov.io/gh/cdibbs/simple-mapper/branch/master/graph/badge.svg)](https://codecov.io/gh/cdibbs/simple-mapper)


# SimpleMapper
SimpleMapper for Angular 2+ provides object-to-object mapping. The original intention was to provide a way to recursively map simple JSON objects into nested view models (thereby gaining the benefit of any view model methods, etc). However, it can be used to map objects of any type.

## What it is not
SimpleMapper is not a full-fledge mapper in the way of, for example, .NET's Automapper. There are no
mapping profiles, and options are limited.

## Usage

```typescript
let myClassVm = mapper.MapJsonToVM(MyClass, { /* JSON object */ }, true);
let myClassVmArray = mapper.MapJsonToVMArray(MyClass, [{ /* JSON object array */ }], false);
```

The optional third argument turns on (default) or off warnings about missing destination properties.

## View Models
Due to the way Typescript works (as of v2.2), you should define your view models so they always have
default values. Otherwise, their properties will not be visible to the mapper:

```typescript 
export class MyWidget {
    Id: number; /* not visible to the mapper. */
    Name: string = null; /* visible due to null default. */
    get Display(): string { 
        return `${Name} (Id: ${Id})`;
    }

    @mappable("MyWidget")
    Wiggy: MyWidget = null;
}
```

If providing view names, then you must provide the view models collection during import (see [Setup](#Setup)). Alternatively, as of v1.1.0+, you can provide classes directly to the `@mappable`: 

```typescript 
export class MyWidget {
    Id: number; /* not visible to the mapper. */
    Name: string = null; /* visible due to null default. */
    get Display(): string { 
        return `${Name} (Id: ${Id})`;
    }

    @mappable(MyWidget)
    Wiggy: MyWidget = null; 
}
```

If a source property exists while a destination does not, a warning will be issued by default.
You can turn this off by providing a third parameter:

```typescript
let json = {
    Id: 314,
    Name: "Chris",
    ExtraProp: "Fidgeting with digits"
};
mapper.MapJsonToVM(MyWidget, json, false);
```

## Installation

Run `npm install --save-dev simple-mapper` inside of an Angular 4 project.


## Setup
Inside your application's app.module.ts file, make the following additions.

```typescript
// ...
import { SimpleMapper } from 'simple-mapper';

// ...
import * as vm from './view-models';

@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        SimpleMapper.forRoot({viewModels: vm, logger: console})
    ]
})
export class AppModule {
    constructor() {
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
