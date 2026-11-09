import * as targeting from "../../dist/core/battle/targeting/index.js";
import * as units from "../../dist/core/unit/query.js";
import { hasTargetable } from "../../dist/core/unit/capability/targetable/capability.js";
import { hasLayer } from "../../dist/core/unit/capability/layer/index.js";
import { topK } from "../../dist/core/common/collection.js";

export function selectDamage({ geometry, canTargetAir = false, maxTargets = 1 }) {
    return (battle, source) => {
        const self = units.get(battle, source);
        const candidates = units.all(battle)
            .filter(hasTargetable)
            .filter(targeting.damage(battle, self))
            .filter(target => canTargetAir || (hasLayer(target) && target.layer.type === "GROUND"))
            .filter(targeting.inRange(self.position, geometry));

        return {
            state: battle,
            value: topK(candidates, maxTargets, targeting.distance(self.position)).map(units.ref),
        };
    };
}
