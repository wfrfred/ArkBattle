import { createWithState, faceTarget, sourceAttack, type Attack } from "../../actions/attack.js";
import type { AttackSpeedTiming } from "../../actions/timing.js";
import { ref as actionRef, setState } from "../../../core/unit/capability/action/index.js";
import * as targeting from "../../../core/battle/targeting/index.js";
import * as units from "../../../core/unit/index.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import type { Classification } from "../../../core/unit/capability/classification/index.js";
import { hasBlockable, type Blocker } from "../../../core/unit/capability/blocking/index.js";
import type { Offense } from "../../../core/unit/capability/offense/index.js";
import { hasDirection } from "../../../core/unit/capability/occupancy/index.js";
import { hasLayer } from "../../../core/unit/capability/layer/index.js";
import { fromTiles } from "../../../core/geometry/range.js";
import { topK } from "../../../core/common/collection/order.js";

import type { Profile } from "../../../data/unit/operator.js";
import type { State as BattleState } from "../../../core/battle/state.js";

export interface State {
    readonly inSession: boolean;
}

export type Host = Classification & Blocker & Offense;

const inDefaultCategory = targeting.inCategories(["DEFAULT"]);

function candidates(battle: BattleState, self: units.Unit & Classification, profile: Profile) {
    const withinRange = hasDirection(self)
        ? targeting.inRange(self.position, fromTiles(profile.range, self.occupancy.direction))
        : () => false;

    return units
        .all(battle)
        .filter(hasTargetable)
        .filter(targeting.damage(self)(battle))
        .filter((target) => hasLayer(target) && target.layer.type === "GROUND")
        .filter(
            (target) =>
                (inDefaultCategory(target) && withinRange(target)) ||
                (hasBlockable(target) && target.blockable.relation?.blocker.id === self.id),
        );
}

export function hasTarget(
    battle: BattleState,
    self: units.Unit & Classification,
    profile: Profile,
): boolean {
    return candidates(battle, self, profile).some(() => true);
}

export function create(profile: Profile, timing: AttackSpeedTiming): Attack<State, object, Host> {
    return createWithState<State, object, Host>({
        id: "normal-attack",
        initialize: (battle) => ({ state: battle, value: { inSession: false } }),
        prepare: (battle) => ({ state: battle, value: {} }),
        timing: (_battle, _source, self) =>
            self.state.inSession ? { ...timing, beginTicks: 0 } : timing,
        onStart(battle, source, self) {
            battle = setState(battle, actionRef(source, self.definition), { inSession: true });

            return faceTarget(battle, source, self);
        },
        onEnd: (battle, source, self, end) =>
            end.type === "CANCELLED"
                ? setState(battle, actionRef(source, self.definition), { inSession: false })
                : battle,
        period: { type: "ATTACK_SPEED" },
        triggerBindingId: "primary",
        followUps: [],
        targetGroups: [
            {
                id: "primary",
                select(battle, source) {
                    const self = units.get(battle, source);
                    if (self === undefined) {
                        return { state: battle, value: [] };
                    }

                    const blockedFirst = targeting.blockedFirst(self);
                    const distance = targeting.distance(self.position);

                    return {
                        state: battle,
                        value: topK(
                            candidates(battle, self, profile),
                            1,
                            (left, right) => blockedFirst(left, right) || distance(left, right),
                        ).map(units.ref),
                    };
                },
                operations: [
                    {
                        type: "DAMAGE",
                        attackType: "NORMAL",
                        applyWay: "MELEE",
                        power: sourceAttack,
                        damageType: "PHYSICAL",
                    },
                ],
            },
        ],
    });
}
