import type { Ref } from "../../../common/ref.js";
import { type State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import { hasAllegiance } from "../allegiance/capability.js";
import { isSpatiallyPresent } from "../presence/capability.js";
import { hasVitality } from "../vitality/capability.js";
import {
    ELEMENT_TYPES,
    hasElemental,
    type Elemental,
    type Parameter,
    type Type,
} from "./capability.js";
import type { Burst } from "./burst.js";
import type { Request as DamageRequest } from "../../../battle/damage/ep/contract.js";
import type { Request as HealingRequest } from "../../../battle/healing/ep/contract.js";

export function get(battle: BattleState, reference: Ref<Burst>): Burst | undefined {
    const burst = units.get(battle, reference.host)?.elemental.burst;

    return burst?.id === reference.id ? burst : undefined;
}

export function resolveMaxEp(battle: BattleState, host: Ref<Unit & Elemental>): number | undefined {
    return resolve(battle, host, "maxEp");
}

export function resolveRecoverySpeed(
    battle: BattleState,
    host: Ref<Unit & Elemental>,
): number | undefined {
    return resolve(battle, host, "recoverySpeed");
}

export function resolveElementResistance(
    battle: BattleState,
    host: Ref<Unit & Elemental>,
): number | undefined {
    return resolve(battle, host, "elementResistance");
}

export function resolveDamageResistance(
    battle: BattleState,
    host: Ref<Unit & Elemental>,
): number | undefined {
    return resolve(battle, host, "damageResistance");
}

export function resolveBurstRecoverySpeed(
    battle: BattleState,
    host: Ref<Unit & Elemental>,
): number | undefined {
    return resolve(battle, host, "burstRecoverySpeed");
}

function resolve(
    battle: BattleState,
    host: Ref<Unit & Elemental>,
    parameter: Parameter,
): number | undefined {
    const self = units.get(battle, host);
    if (self === undefined) {
        return undefined;
    }

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

export function currentType(self: Unit, maxEp?: number): Type | undefined {
    if (!hasElemental(self)) {
        return undefined;
    }

    let selected: Type | undefined;
    let minimum = maxEp ?? self.definition.elemental.maxEp;

    for (const type of ELEMENT_TYPES) {
        if (self.elemental.ep[type] < minimum) {
            selected = type;
            minimum = self.elemental.ep[type];
        }
    }

    return selected;
}

export function damageRatio(self: Unit, maxEp?: number): number {
    if (!hasElemental(self)) {
        return 0;
    }

    const maximum = maxEp ?? self.definition.elemental.maxEp;
    const type = currentType(self, maximum);

    return type === undefined ? 0 : Math.min(1, Math.max(0, 1 - self.elemental.ep[type] / maximum));
}

export function resolveDamageRatio(
    battle: BattleState,
    host: Ref<Unit & Elemental>,
): number | undefined {
    const self = units.get(battle, host);

    return self === undefined ? undefined : damageRatio(self, resolveMaxEp(battle, host));
}
