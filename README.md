[![npm version](https://badge.fury.io/js/simple-mapper.svg)](https://badge.fury.io/js/simple-mapper)
[![Build Status](https://travis-ci.org/cdibbs/simple-mapper.svg?branch=master)](https://travis-ci.org/cdibbs/simple-mapper)
[![dependencies Status](https://david-dm.org/cdibbs/simple-mapper/status.svg)](https://david-dm.org/cdibbs/simple-mapper)
[![devDependencies Status](https://david-dm.org/cdibbs/simple-mapper/dev-status.svg)](https://david-dm.org/cdibbs/simple-mapper?type=dev)
[![codecov](https://codecov.io/gh/cdibbs/simple-mapper/branch/master/graph/badge.svg)](https://codecov.io/gh/cdibbs/simple-mapper)


# SimpleMapper
SimpleMapper provides simple, object-to-object mapping by convention. It was created to solve
the problem of recursively mapping JSON replies to models, in order to gain the benefits of
their methods and default values. However, it can be used to map from Javascript objects of
any type, to objects of any type.

## What it is not
SimpleMapper doesn't currently have the option of configuration-based mapping, in the way of
a more full-fledge mapper such as .NET's Automapper. There are no mapping profiles, and options
are limited. Hence the name SimpleMapper.

## Usage

```typescript
let myClassVm = mapper.map(MyClass, { /* JSON object */ }, true);
let myClassVmArray = mapper.mapArray(MyClass, [{ /* JSON object array */ }], false);
```

The optional third argument turns on (default) or off warnings about missing destination properties.

## Models
Due to the way Typescript works (as of v2.2), you should define your models so they always have
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

    @mappable(MyWidget)
    Wig2: MyWidget = null;
}
```

If providing model names instead of references, then you must provide a model collection during import
(see [Setup](#Setup)).

If a source property exists while a destination does not, a warning will be issued by default.
You can turn this off by providing a third parameter:

```typescript
let json = {
    Id: 314,
    Name: "Chris",
    ExtraProp: "Missing in the destination model, MyWidget."
};
mapper.MapJsonToVM(MyWidget, json, false);
```

## Installation

`npm install --save-dev simple-mapper`


## Setup
```typescript
// if you are using dependency injection...
import { MapperService, IMapperService, IConfig } from 'simple-mapper';
import * as models from './models/barrel/';

export let MapperServiceToken = new Symbol("MapperService");
let config = <IConfig> {
    models: models,
    noUnmappedWarnings: true,
    validateOnStartup: true
};

// something like one of these...
diContainer.bind<IMapperService>(MapperServiceToken).to(MapperService);
diContainer.bind<IMapperService>(MapperServiceToken).to(() => new MapperService(config, console));
```

## Options
```typescript
let config: IConfig = {
    /** The dictionary of models to use for recursive mapping. 
      * Not needed if using object references in @mappable() instead of names.
      * Default: empty. */
    models: {},

    /** Validate models provided on instantiation (makes sure mappable names exist in your models collection).
     * Default: false.
     */
    validateOnStartup: false,

    /** Turn off unmapped source property warnings globally. Can be overridden at the method level. */
    noUnmappedWarnings: false
}
```

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests.
Run `npm run cover` to run tests and generate a code coverage report.
Code coverage will be available at ./coverage/index.html.

## Documentation

Run 'npm run compodoc' to generate documentation.
Then run 'npm run compodoc-serve' to see auto-generated documentation and documentation coverage on port 8080.

## Further help

Feel free to post issues.
