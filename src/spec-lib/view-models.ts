import { mappable } from '../lib/mappable.decorator';

export class Mine {
    Id: number = 3;
    One: string = "string";
    Two: number = 3.14;
    Three: string = null;
}

export class MineTwo {
}

export class MineMinusTwo {
    Id: number = 3;
    One: string = "string";
    Three: string = null;
}

export class Nested_MineTwo {
    Id: number = 3;
    Another: string = "for me";
    get Computed(): string { return this.Another + " and me" };
}
export class Nested_Mine {
    Id: number = 3;
    One: string = "string";
    @mappable("Nested_MineTwo")
    Prop: Nested_MineTwo = null;
}

export class NestedTypo {
    Id: number = 3;
    @mappable("MySillyTypo")
    Prop: Nested_MineTwo = null;
}

export class Observable_MineTwo {
    Id: number = 3;
    Another: string = "for me";
    get Computed(): string { return this.Another + " and me" };
}
export class Observable_Mine {
    Id: number = 3;
    One: string = "string";
    @mappable("Observable_MineTwo")
    Prop: Observable_MineTwo = null;
}

export class NestedArrayTypes_MineTwo {
    Id: number = 3;
    Another: string = "for me";
    get Computed(): string { return this.Another + " and me" };
}
export class NestedArrayTypes_Mine {
    Id: number = 3;
    One: string = "string";
    @mappable("NestedArrayTypes_MineTwo")
    Props: NestedArrayTypes_MineTwo[] = [];
}

export class ByRefTwo {
    Name: string = "";
    get Calculated(): string { return this.Name + " else"; }
}

export class ByRefNested {
    Id: number = 3;
    @mappable(ByRefTwo)
    Two: ByRefTwo = null;
}

export class ByRefNestedArray {
    Id: number = 3;
    @mappable(ByRefTwo)
    Two: ByRefTwo[] = [];
}

export class ValidateTestClass {
    Id: number = 3;
}
export class ValidateTestClass2 {
    Name: string = "";
    @mappable("ValidateTestClass")
    Mine: Mine = null;
}
export class InvalidValidateTestClass {
    Name: string = "";
    @mappable("ABogusReferenceFromMeToYou")
    Mine: Mine = null;
}

export class WeirdModel {
    @mappable(Boolean)
    bogus: Boolean = null;
}

export class Unwritable {
    constructor() {
        Object.freeze(this);
    }
    unwritableProp: string = "can't change this";
}