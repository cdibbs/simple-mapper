![Travis Status](https://travis-ci.org/cdibbs/simple-mapper.svg?branch=master)

# SimpleMapper
SimpleMapper provides object-to-object mapping. It can be used to map objects of any type, though the original intention was to provide
a way to recursively map simple JSON objects into nested view models (thereby gaining the benefit of any view model methods, etc).

# Setup

```typescript
// ...
import { SimpleMapper } from 'simple-mapper';

@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        SimpleMapper.forRoot(config)
    ]
})
export class AppModule {
    constructor() {
```

# Usage

```typescript
let myClassVm = mapper.MapJsonToVM(MyClass, { /* JSON object */ }, true);
let myClassVmArray = mapper.MapJsonToVMArray(MyClass, [{ /* JSON object array */ }], false);
```

The optional third argument turns off warnings about missing destination properties.

# View Models

Due to the way Typescript works (as of v2.2), you should define your view models so they always have default values. Otherwise, their properties
will not be visible to the mapper:

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

If a source property exists while a destination doesn't, a warning will be issued by default. You can turn this off with:

```typescript
let json = {
    Id: 314,
    Name: "Chris",
    ExtraProp: "Fidgeting with digits"
};
mapper.MapJsonToVM(MyWidget, json, false);
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
