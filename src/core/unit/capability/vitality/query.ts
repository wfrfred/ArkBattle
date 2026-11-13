import type { State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import { resolveMaxHp, type Parameter, type Vitality } from "./capability.js";

export function resolveDefense(battle: BattleState, self: Unit & Vitality): number {
    return Math.max(0, resolve(battle, self, "defense"));
}

export function resolveResistance(battle: BattleState, self: Unit & Vitality): number {
    return Math.min(100, Math.max(0, resolve(battle, self, "resistance")));
}

export function resolveRecoverySpeed(battle: BattleState, self: Unit & Vitality): number {
    const speed = Math.max(0, resolve(battle, self, "recoverySpeed"));
    const ratio = Math.min(1, Math.max(0, resolve(battle, self, "recoveryRatio")));

    return speed + resolveMaxHp(self.definition.vitality, self.vitality) * ratio;
}

function resolve(battle: BattleState, self: Unit & Vitality, parameter: Parameter): number {
    return attribute.apply(
        self.definition.vitality[parameter],
        contribution
            .resolve(self.vitality[parameter])
            .flatMap((input) => (typeof input === "function" ? input(battle, self) : input)),
    );
}
