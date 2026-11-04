import * as targeting from "../../dist/core/battle/targeting/index.js";

export function damage({ geometry, canTargetAir = false, maxTargets = 1 }) {
    return {
        purposes: ["DAMAGE"],
        filter: targeting.and(targeting.damage, ...(canTargetAir ? [] : [targeting.ground]), targeting.range(geometry)),
        selector: targeting.first(maxTargets, targeting.distance),
    };
}
