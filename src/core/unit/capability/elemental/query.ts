import type { Ref } from "../../../common/ref.js";
import { type State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import * as attribute from "../../attribute.js";
import { hasClassification } from "../classification/index.js";
import { hasVitality } from "../vitality/capability.js";
import { isAlive } from "../vitality/query.js";
import { ELEMENT_TYPES, type Elemental, type Parameter, type Type } from "./capability.js";
import type { Burst } from "./burst.js";
import type { Request as DamageRequest } from "../../../battle/resource/ep/damage/contract.js";
import type { Request as HealingRequest } from "../../../battle/resource/ep/healing/contract.js";
import { allows } from "../../../restriction.js";
import type { DamageRestriction } from "./restriction.js";

export function get(battle: BattleState, reference: Ref<Burst>): Burst | undefined {
    const host = reference.host.get(battle);

    return host?.elemental.burst === reference ? reference.get(battle) : undefined;
}

export function resolveMaxEp(battle: BattleState, self: Unit & Elemental): number {
    return resolve(battle, self, "maxEp");
}

export function resolveRecoverySpeed(battle: BattleState, self: Unit & Elemental): number {
    return resolve(battle, self, "recoverySpeed");
}

export function resolveElementResistance(battle: BattleState, self: Unit & Elemental): number {
    return resolve(battle, self, "elementResistance");
}

export function resolveDamageResistance(battle: BattleState, self: Unit & Elemental): number {
    return resolve(battle, self, "damageResistance");
}

export function resolveBurstRecoverySpeed(battle: BattleState, self: Unit & Elemental): number {
    return resolve(battle, self, "burstRecoverySpeed");
}

function resolve(battle: BattleState, self: Unit & Elemental, parameter: Parameter): number {
    return attribute.resolve(
        self.definition.elemental[parameter],
        self.elemental[parameter],
        battle,
        self,
    );
}

export function available(self: Unit & Elemental): boolean {
    return self.lifecycle === "ACTIVE" && (!hasVitality(self) || isAlive(self));
}

export function canReceiveDamage(
    battle: BattleState,
    request: DamageRequest,
    type: Type = request.parameters.type,
    ignore?: (restriction: DamageRestriction) => boolean,
): boolean {
    const self = request.target.get(battle);

    return (
        self !== undefined &&
        available(self) &&
        self.elemental.burst === null &&
        (!hasClassification(self) || self.definition.classification.side !== "NEUTRAL") &&
        allows(battle, { self, request, type }, self.elemental.damageRestrictions, ignore)
    );
}

export function canReceiveHealing(battle: BattleState, request: HealingRequest): boolean {
    const self = request.target.get(battle);

    return (
        self !== undefined &&
        available(self) &&
        self.elemental.burst === null &&
        allows(battle, { self, request }, self.elemental.healingRestrictions)
    );
}

export function currentType(self: Unit & Elemental, maxEp: number): Type | undefined {
    let selected: Type | undefined;
    let minimum = maxEp;

    for (const type of ELEMENT_TYPES) {
        if (self.elemental.ep[type] < minimum) {
            selected = type;
            minimum = self.elemental.ep[type];
        }
    }

    return selected;
}

export function damageRatio(self: Unit & Elemental, maxEp: number): number {
    const type = currentType(self, maxEp);

    return type === undefined ? 0 : Math.min(1, Math.max(0, 1 - self.elemental.ep[type] / maxEp));
}

export function resolveDamageRatio(battle: BattleState, self: Unit & Elemental): number {
    return damageRatio(self, resolveMaxEp(battle, self));
}
