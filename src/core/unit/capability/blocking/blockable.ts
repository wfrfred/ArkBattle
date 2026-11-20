import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertPositiveSafeInteger } from "../../../common/assert.js";
import * as contribution from "../../../common/contribution.js";
import { validateRestrictions } from "../../../restriction.js";
import type { Unit } from "../../unit.js";
import type { Relation, Hook } from "./contract.js";
import type { Restriction } from "./restriction.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import { removing } from "./blockable-operations.js";
import { Hooks as UnitHooks, key } from "../../../hook.js";
import { removing as removingKey } from "../../hook.js";

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
}

export interface Definition extends Restrictions {
    readonly volume: number;
}

export interface PositionAdjustment {
    readonly from: WorldPosition;
    readonly to: WorldPosition;
    readonly startTick: number;
}

export interface State extends Restrictions {
    readonly relation: Relation | null;
    readonly adjustment: PositionAdjustment | null;
    readonly volume: readonly contribution.Contribution<number>[];
}

export interface Blockable {
    readonly definition: {
        readonly blockable: Definition;
    };
    readonly blockable: State;
}

export const acquired = key<Hook<Unit & Blockable>, Unit & Blockable>("blockable.acquired");

export const released = key<Hook<Unit & Blockable>, Unit & Blockable>("blockable.released");

export function hasBlockable<U extends Unit>(unit: U): unit is U & Blockable {
    return "blockable" in unit && "blockable" in unit.definition;
}

export function initialize<U extends Unit & Pick<Blockable, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Blockable> {
    const { volume, restrictions } = unit.definition.blockable;
    assertPositiveSafeInteger(volume, "blocking volume");
    validateRestrictions(restrictions);

    return {
        state: battle,
        value: {
            ...unit,
            hooks: UnitHooks.empty().set(removingKey, removing).merge(unit.hooks),
            blockable: {
                relation: null,
                adjustment: null,
                volume: [],
                restrictions,
            },
        },
    };
}

export function stableBlockPosition(unit: Unit & Blockable): WorldPosition {
    return unit.blockable.relation === null
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
