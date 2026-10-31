import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertPositiveSafeInteger } from "../../../common/assert.js";
import * as contribution from "../../contribution/contribution.js";
import type { Unit } from "../../unit.js";
import type { Ref } from "../../../common/ref.js";
import type { Blocker } from "./blocker.js";
import type { Hook } from "./contract.js";
import type { Rule } from "./rule.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";

export interface Definition {
    readonly volume: number;
}

export interface PositionAdjustment {
    readonly from: WorldPosition;
    readonly to: WorldPosition;
    readonly startTick: number;
}

export interface State {
    readonly blocker: Ref<Unit & Blocker> | null;
    readonly adjustment: PositionAdjustment | null;
    readonly volume: readonly contribution.Contribution<number>[];
    readonly rules: readonly Rule[];
    readonly acquired: readonly Hook<Unit & Blockable>[];
    readonly released: readonly Hook<Unit & Blockable>[];
}

export interface Blockable {
    readonly definition: {
        readonly blockable: Definition;
    };
    readonly blockable: State;
}

export function hasBlockable<U extends Unit>(unit: U): unit is U & Blockable {
    return "blockable" in unit && "blockable" in unit.definition;
}

export function initialize(battle: BattleState, definition: Definition): Result<State> {
    assertPositiveSafeInteger(definition.volume, "blocking volume");

    return {
        state: battle,
        value: {
            blocker: null,
            adjustment: null,
            volume: [],
            rules: [],
            acquired: [],
            released: [],
        },
    };
}

export function stableBlockPosition(unit: Unit & Blockable): WorldPosition {
    return unit.blockable.blocker === null
        ? unit.position
        : (unit.blockable.adjustment?.to ?? unit.position);
}

export function resolveVolume(definition: Definition, state: State): number {
    return Math.max(
        1,
        contribution
            .resolve(state.volume)
            .reduce((volume, addition) => volume + addition, definition.volume),
    );
}
