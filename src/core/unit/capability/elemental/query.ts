import type { Ref } from "../../../common/ref.js";
import { type State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import { hasAllegiance } from "../allegiance/capability.js";
import { isSpatiallyPresent } from "../presence/capability.js";
import { hasVitality } from "../vitality/capability.js";
import { ELEMENT_TYPES, type Elemental, type Parameter, type Type } from "./capability.js";
import type { Burst } from "./burst.js";
import type { Request as DamageRequest } from "../../../battle/damage/ep/contract.js";
import type { Request as HealingRequest } from "../../../battle/healing/ep/contract.js";

export function get(battle: BattleState, reference: Ref<Burst>): Burst | undefined {
    const burst = units.get(battle, reference.host)?.elemental.burst;

    return burst?.id === reference.id ? burst : undefined;
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
    const base =
        parameter === "recoverySpeed"
            ? self.definition.elemental.recoveryPerSecond
            : self.definition.elemental[parameter];
    const value = attribute.apply(
        base,
        contribution
            .resolve(self.elemental[parameter])
            .flatMap((input) => (typeof input === "function" ? input(battle, self) : input)),
    );

    if (parameter === "maxEp") {
        return Math.max(1, value);
    }
    if (parameter === "elementResistance" || parameter === "damageResistance") {
        return Math.min(95, Math.max(0, value));
    }

    return Math.max(0, value);
}

export function available(self: Unit): boolean {
    return (
        self.lifecycle === "PRESENT" &&
        isSpatiallyPresent(self) &&
        (!hasVitality(self) || self.vitality.hp > 0)
    );
}

export function canReceiveDamage(
    battle: BattleState,
    request: DamageRequest,
    type: Type = request.type,
): boolean {
    const self = units.get(battle, request.target);

    return (
        self !== undefined &&
        available(self) &&
        self.elemental.burst === null &&
        (!hasAllegiance(self) || self.allegiance.side !== "NEUTRAL") &&
        self.elemental.rules.damage.every((rule) => rule.allows(battle, { self, request, type }))
    );
}

export function canReceiveHealing(battle: BattleState, request: HealingRequest): boolean {
    const self = units.get(battle, request.target);

    return (
        self !== undefined &&
        available(self) &&
        self.elemental.burst === null &&
        self.elemental.rules.heal.every((rule) => rule.allows(battle, { self, request }))
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
