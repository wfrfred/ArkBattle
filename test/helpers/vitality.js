import { calculateDamage, applyDamage } from "../../dist/core/resource/hp/damage/index.js";

export function parameters(power, type = "PHYSICAL", penetration = { fixed: 0, proportional: 0 }) {
    const attack = { power, multiplier: 1, addition: 0 };
    return type === "PHYSICAL" || type === "ARTS"
        ? { type, attack, penetration }
        : { type, attack };
}

export function damage(battle, request) {
    const incoming = { killer: request.source, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, ...request };
    return applyDamage(incoming, calculateDamage(battle, incoming));
}
