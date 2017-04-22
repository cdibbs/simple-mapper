import { mappable } from '../decorators/mappable.decorator';

// Test view models
export class UnheardOf {
}
export class Mine {
    @mappable(UnheardOf)
    Prop: UnheardOf = null;
}