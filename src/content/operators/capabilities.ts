import { allyBursts } from "../../core/effects/elemental/index.js";
import { calculateOffset } from "../../core/battle/blocking/index.js";
import { blocker as blocking, sides } from "../../core/unit/capability/blocking/index.js";
import { TICKS_PER_SECOND } from "../../core/tick.js";
import type { Definition as ActionDefinition } from "../../core/unit/capability/action/capability.js";
import type { Operator } from "./operator.js";
import type { Attributes } from "./parameters.js";

export function targetable(taunt: number): Operator["definition"]["targetable"] {
    return {
        category: "DEFAULT",
        taunt: { default: taunt, min: -2, max: 2 },
        restrictions: [],
    };
}

export function deployable(): Operator["definition"]["deployable"] {
    return { retreatRestrictions: [], refund: { rate: 0.5, limit: "BASE_COST" } };
}

export function elemental(): Operator["definition"]["elemental"] {
    return {
        maxEp: { default: 1000, min: 1, max: null },
        recoverySpeed: { default: 0, min: 0, max: null },
        elementResistance: { default: 0, min: 0, max: 100 },
        damageResistance: { default: 0, min: 0, max: 100 },
        burstRecoverySpeed: { default: 1, min: 0, max: null },
        bursts: allyBursts,
    };
}

export function vitality(
    attributes: Pick<Attributes, "maxHp" | "defense" | "resistance" | "recoverySpeed">,
): Operator["definition"]["vitality"] {
    return {
        maxHp: { default: attributes.maxHp, min: 1, max: null },
        defense: { default: attributes.defense, min: 0, max: null },
        resistance: { default: attributes.resistance, min: 0, max: 100 },
        recoverySpeed: { default: attributes.recoverySpeed, min: 0, max: null },
        recoveryRatio: { default: 0, min: 0, max: 1 },
    };
}

export function offense(attack: number): Operator["definition"]["offense"] {
    return { attack: { default: attack, min: 0, max: null } };
}

export function blocker(capacity: number): Operator["definition"]["blocker"] {
    return {
        calculateOffset,
        capacity,
        rule: blocking.ground,
        restrictions: [{ id: "blocking/sides", group: null, value: sides("ENEMY") }],
    };
}

export function actionAttributes(
    attackSpeed: number,
    baseAttackTime: number,
): Pick<ActionDefinition, "speed" | "interval"> {
    return {
        speed: { default: attackSpeed, min: 20, max: null },
        interval: { default: baseAttackTime * TICKS_PER_SECOND, min: 0, max: null },
    };
}
