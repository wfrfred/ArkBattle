import { createWithState, faceTarget, sourceAttack, type Attack } from "../../actions/attack.js";
import type { AttackSpeedTiming } from "../../actions/timing.js";
import { ref as actionRef, setState } from "../../../core/unit/capability/action/index.js";
import * as targeting from "../../../core/battle/targeting/index.js";
import * as units from "../../../core/unit/index.js";
import { hasTargetable } from "../../../core/unit/capability/targetable/capability.js";
import { hasBlockable, type Blocker } from "../../../core/unit/capability/blocking/index.js";
import type { Classification } from "../../../core/unit/capability/classification/index.js";
import type { Occupancy } from "../../../core/unit/capability/occupancy/index.js";
import type { Offense } from "../../../core/unit/capability/offense/index.js";
import { hasLayer } from "../../../core/unit/capability/layer/index.js";
import { fromTiles } from "../../../core/geometry/range.js";
import type { TilePosition } from "../../../core/geometry/coordinate.js";
import { topK } from "../../../core/common/collection/order.js";
import type { State as BattleState } from "../../../core/battle/state.js";

export interface State {
    readonly inSession: boolean;
}

export interface AttackParameters {
    readonly range: readonly TilePosition[];
    readonly timing: AttackSpeedTiming;
}

type Host = Classification & Occupancy & Blocker & Offense;

const inDefaultCategory = targeting.inCategories(["DEFAULT"]);

function candidates(
    battle: BattleState,
    self: units.Unit & Classification & Occupancy,
    range: readonly TilePosition[],
) {
    const { direction } = self.occupancy;
    const withinRange =
        direction === null
            ? () => false
            : targeting.inRange(self.position, fromTiles(range, direction));

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
    self: units.Unit & Classification & Occupancy,
    range: readonly TilePosition[],
): boolean {
    return candidates(battle, self, range).some(() => true);
}

export function create({ range, timing }: AttackParameters): Attack<State, object, Host> {
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
                            candidates(battle, self, range),
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
