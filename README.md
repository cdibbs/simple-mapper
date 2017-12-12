[![npm version](https://badge.fury.io/js/simple-mapper.svg)](https://badge.fury.io/js/simple-mapper)
[![Build Status](https://travis-ci.org/ossplz/simple-mapper.svg?branch=master)](https://travis-ci.org/ossplz/simple-mapper)
[![dependencies Status](https://david-dm.org/ossplz/simple-mapper/status.svg)](https://david-dm.org/ossplz/simple-mapper)
[![devDependencies Status](https://david-dm.org/ossplz/simple-mapper/dev-status.svg)](https://david-dm.org/ossplz/simple-mapper?type=dev)
[![codecov](https://codecov.io/gh/ossplz/simple-mapper/branch/master/graph/badge.svg)](https://codecov.io/gh/ossplz/simple-mapper)


# SimpleMapper
SimpleMapper provides simple, object-to-object mapping by convention. It was created to solve
the problem of recursively mapping JSON to models, in order to gain the benefits of those models,
particularly their methods and default values. However, it can be used to map from Javascript
objects of any type, to objects of any type.

## Usage

```typescript
let myClassVm = mapper.map(MyClass, { /* JSON object */ }, true);
let myClassVmArray = mapper.mapArray(MyClass, [{ /* JSON object array */ }], false);
```

The optional third argument turns on (default) or off warnings about missing destination properties.

## Models
Due to the way Typescript works (as of v2.2), you should define your models so they always have
default values. Otherwise, their properties will not be visible to the mapper.

Be sure the default values for iterables are empty iterables (both in the source and destination),
otherwise the properties will be mapped like ordinary properties.

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
    WigArray: MyWidget[] = [];
}
```

If providing model names as strings instead of references, then you must provide a model collection
during import (see [Setup](#Setup)).

If a source property exists while a destination does not, a warning will be issued by default.
You can turn this off by providing a third parameter:

```typescript
let json = {
    Id: 314,
    Name: "Chris",
    ExtraProp: "Missing in the destination model, MyWidget."
};
mapper.map(MyWidget, json, false);
```

## Installation

`npm install --save-dev simple-mapper`

## Setup
```typescript
// if you are using dependency injection, your setup might look like this:

import { MapperService, IMapperService, IConfig } from 'simple-mapper';
import * as models from './models/barrel/';

export let MapperServiceToken = new Symbol("MapperService");

diContainer.bind<IMapperService>(MapperServiceToken).to(MapperService);

// or with configuration...

let config = <IConfig> {
    models: models,
    unmappedWarnings: true,
    validateOnStartup: true
};
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
    unmappedWarnings: false
}
```

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests.
Run `npm run cover` to run tests and generate a code coverage report.
Code coverage will be available at ./coverage/index.html.

## Documentation

The scaffolding exists, but no real documentation, for the moment. Run 'npm run compodoc' to generate documentation.
Then run 'npm run compodoc-serve' to see auto-generated documentation and documentation coverage on port 8080.

## Further help

Feel free to post issues.
