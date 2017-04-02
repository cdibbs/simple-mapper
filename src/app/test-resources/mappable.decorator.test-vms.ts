import { mappable } from '../decorators/mappable.decorator';

// Test view models
export class UnheardOf {
    Id: number = 3;
}
export class Mine {
    Id: number = 4;
    @mappable(UnheardOf)
    Prop: UnheardOf = null;
}