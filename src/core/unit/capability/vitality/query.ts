import type { State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import type { Ref } from "../../../common/ref.js";
import type * as damage from "../../../battle/resource/hp/damage/index.js";
import { allows } from "../../../restriction.js";
import type { Restriction } from "./restriction.js";
import * as attribute from "../../attribute.js";
import { resolveMaxHp, type Parameter, type Vitality } from "./capability.js";

export function isAlive(self: Unit & Vitality): boolean {
    return self.vitality.health.hp > 0;
}

export function hpRatio(self: Unit & Vitality): number {
    return self.vitality.health.hp / resolveMaxHp(self.definition.vitality, self.vitality);
}

export function resolveDefense(battle: BattleState, self: Unit & Vitality): number {
    return resolve(battle, self, "defense");
}

export function resolveResistance(battle: BattleState, self: Unit & Vitality): number {
    return resolve(battle, self, "resistance");
}

export function resolveRecoverySpeed(battle: BattleState, self: Unit & Vitality): number {
    const speed = resolve(battle, self, "recoverySpeed");
    const ratio = resolve(battle, self, "recoveryRatio");

    return speed + resolveMaxHp(self.definition.vitality, self.vitality) * ratio;
}

export function canReceiveDamage(
    battle: BattleState,
    context: damage.ReceivingContext,
    ignore?: (restriction: Restriction) => boolean,
): boolean {
    const target = context.request.target.get(battle);

    return (
        target?.lifecycle === "ACTIVE" &&
        isAlive(target) &&
        allows(battle, context, target.vitality.damageRestrictions, ignore)
    );
}

export function canReceiveHp(battle: BattleState, target: Ref<Unit & Vitality>): boolean {
    const unit = target.get(battle);

    return unit?.lifecycle === "ACTIVE" && isAlive(unit);
}

function resolve(battle: BattleState, self: Unit & Vitality, parameter: Parameter): number {
    return attribute.resolve(
        self.definition.vitality[parameter],
        self.vitality[parameter],
        battle,
        self,
    );
}
