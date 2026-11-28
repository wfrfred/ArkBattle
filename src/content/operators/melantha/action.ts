import { normalMeleeCandidates, selectNormalMeleeTarget } from "../targeting.js";
import { normalMeleeOutput } from "../../actions/normal-melee.js";
import { createWithState, faceTarget, type Attack } from "../../actions/attack.js";
import type { AttackSpeedTiming } from "../../actions/timing.js";
import { setState } from "../../../core/unit/capability/action/index.js";
import type { Unit } from "../../../core/unit/index.js";
import type { Blocker } from "../../../core/unit/capability/blocking/index.js";
import type { Classification } from "../../../core/unit/capability/classification/index.js";
import type { Occupancy } from "../../../core/unit/capability/occupancy/index.js";
import type { Offense } from "../../../core/unit/capability/offense/index.js";
import type { TilePosition } from "../../../core/geometry/coordinate.js";
import type { State as BattleState } from "../../../core/battle/state.js";

export interface State {
    readonly inSession: boolean;
}

export interface AttackParameters {
    readonly range: readonly TilePosition[];
}

type Host = Classification & Occupancy & Blocker & Offense;

const timing: AttackSpeedTiming = {
    type: "ATTACK_SPEED",
    beginTicks: 15,
    durationTicks: 30,
    releaseTicks: 14,
    minScale: 0,
    maxScale: null,
};

export function hasTarget(
    battle: BattleState,
    self: Unit & Classification & Occupancy,
    range: readonly TilePosition[],
): boolean {
    return normalMeleeCandidates(battle, self, range).some(() => true);
}

export function create({ range }: AttackParameters): Attack<State, object, Host> {
    return createWithState<State, object, Host>({
        id: "normal-attack",
        initialize: (battle) => ({ state: battle, value: { inSession: false } }),
        prepare: (battle) => ({ state: battle, value: {} }),
        timing: (_battle, _host, self) =>
            self.state.inSession ? { ...timing, beginTicks: 0 } : timing,
        onStart(battle, host, self, action) {
            battle = setState(battle, action, { inSession: true });

            return faceTarget(battle, host, self);
        },
        onEnd: (battle, _host, _self, action, end) =>
            end.type === "CANCELLED" ? setState(battle, action, { inSession: false }) : battle,
        period: { type: "ATTACK_SPEED" },
        applyWay: "MELEE",
        select(battle, source) {
            const self = source.get(battle);
            if (self === undefined) {
                return { state: battle, value: [] };
            }

            return {
                state: battle,
                value: selectNormalMeleeTarget(battle, self, range),
            };
        },
        output: normalMeleeOutput,
    });
}
