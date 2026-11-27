import * as action from "./action/capability.js";
import * as classification from "./classification/index.js";
import * as blockable from "./blocking/blockable/blockable.js";
import * as blocker from "./blocking/blocker/blocker.js";
import * as deployable from "./deployable/capability.js";
import * as elemental from "./elemental/capability.js";
import * as facing from "./facing/capability.js";
import * as hitbox from "./hitbox/capability.js";
import * as layer from "./layer/capability.js";
import * as locomotion from "./locomotion/capability.js";
import * as occupancy from "./occupancy/capability.js";
import * as offense from "./offense/capability.js";
import * as presence from "./presence/capability.js";
import * as route from "./route/capability.js";
import * as shiftable from "./shifting/shiftable.js";
import * as shifter from "./shifting/shifter.js";
import * as skill from "./skill/capability.js";
import * as targetable from "./targetable/capability.js";
import * as vitality from "./vitality/capability.js";

export const initializers = {
    occupancy: occupancy.initialize,
    deployable: deployable.initialize,
    vitality: vitality.initialize,
    offense: offense.initialize,
    facing: facing.initialize,
    action: action.initialize,
    skill: skill.initialize,
    elemental: elemental.initialize,
    classification: classification.initialize,
    layer: layer.initialize,
    hitbox: hitbox.initialize,
    blocker: blocker.initialize,
    locomotion: locomotion.initialize,
    blockable: blockable.initialize,
    shifter: shifter.initialize,
    shiftable: shiftable.initialize,
    route: route.initialize,
    presence: presence.initialize,
    targetable: targetable.initialize,
} as const;

export type Definitions = {
    readonly [K in keyof typeof initializers]: Parameters<
        (typeof initializers)[K]
    >[1]["definition"] extends Readonly<Record<K, infer D>>
        ? D
        : never;
};

export type States = {
    readonly [K in keyof typeof initializers]: ReturnType<
        (typeof initializers)[K]
    >["value"] extends Readonly<Record<K, infer S>>
        ? S
        : never;
};

export type Inputs = {
    readonly [K in keyof typeof initializers]: Parameters<(typeof initializers)[K]> extends [
        unknown,
        unknown,
        ...infer Rest,
    ]
        ? Exclude<Rest[0], undefined>
        : never;
};

type SelectedKeys<D> = {
    [K in keyof States]: [D] extends [Readonly<Record<K, Definitions[K]>>] ? K : never;
}[keyof States];

type RequiredInputKeys = {
    [K in keyof Inputs]: Parameters<(typeof initializers)[K]> extends [
        unknown,
        unknown,
        unknown,
        ...unknown[],
    ]
        ? K
        : never;
}[keyof Inputs];

export type Initial<D> = unknown extends D
    ? Partial<Inputs>
    : Partial<Inputs> & Pick<Inputs, Extract<SelectedKeys<D>, RequiredInputKeys>>;

export type Product<D> = {
    readonly definition: D;
} & Pick<States, SelectedKeys<D>>;
