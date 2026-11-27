import type { State as BattleState, Result } from "../../../../battle/state.js";
import { assertPositiveSafeInteger, assertSafeInteger } from "../../../../common/assert.js";
import * as contribution from "../../../../common/contribution.js";
import { validateRestrictions } from "../../../../restriction.js";
import type { Unit } from "../../../unit.js";
import type { Relation, Hook } from "../contract.js";
import type { Restriction } from "../restriction.js";
import { settleRestrictions } from "../../../../battle/blocking/operations.js";
import type { WorldPosition } from "../../../../geometry/coordinate.js";
import { removing } from "./operations.js";
import { key } from "../../../../hook.js";
import { removing as removingKey } from "../../../hook.js";
import { createRegistrationOperations } from "../../../registration.js";
import type { Change } from "../../../change.js";
import { ref } from "../../../query.js";
import { settleCapacity } from "../blocker/operations.js";
import {
    hasLocomotion,
    setRestriction as setLocomotionRestriction,
} from "../../locomotion/capability.js";

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
}

export interface Definition extends Restrictions {
    readonly volume: number;
}

export interface BlockOffset {
    readonly from: WorldPosition;
    readonly to: WorldPosition;
    readonly startTick: number;
}

export interface State extends Restrictions {
    readonly relation: Relation | null;
    readonly offset: BlockOffset | null;
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

    const value: U & Blockable = {
        ...unit,
        hooks: unit.hooks.set(removingKey, removing),
        blockable: {
            relation: null,
            offset: null,
            volume: [],
            restrictions,
        },
    };

    return {
        state: battle,
        value: hasLocomotion(value)
            ? setLocomotionRestriction({
                  id: "@blockable/held",
                  group: null,
                  value: {
                      allows: (_battle, { self }) =>
                          !hasBlockable(self) || self.blockable.relation === null,
                  },
              })(value).next
            : value,
    };
}

export function resolveVolume(definition: Definition, state: State): number {
    return Math.max(
        1,
        contribution
            .resolve(state.volume)
            .reduce((volume, addition) => volume + addition, definition.volume),
    );
}

const registration = createRegistrationOperations<Unit & Blockable>();

export const { set: setRestriction, remove: removeRestriction } = registration(
    "blockable",
    "restrictions",
    settleRestrictions,
);

const volume = registration("blockable", "volume", (battle, previous) => {
    const owner = ref(previous).get(battle)?.blockable.relation?.blocker;

    return owner == null ? battle : settleCapacity(battle, owner);
});

export function setVolumeContribution(
    entry: contribution.Contribution<number>,
): Change<Unit & Blockable> {
    assertSafeInteger(entry.value, "blocking volume addition");

    return volume.set(entry);
}

export const removeVolumeContribution = volume.remove;
