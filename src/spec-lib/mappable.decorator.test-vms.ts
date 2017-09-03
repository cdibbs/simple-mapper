import { mappable } from '../lib/mappable.decorator';

// Test view models
export class UnheardOf {
}
export class Mine {
    @mappable(UnheardOf)
    Prop: UnheardOf = null;
}
export class MineWithTwo {
    @mappable(Mine)
    Prop1: Mine = null

    @mappable(UnheardOf)
    Prop2: UnheardOf = null;
}

export class OnlyMineA {

}

export class OnlyMineB {
    @mappable(OnlyMineA)
    Prop1: OnlyMineA = null;
}