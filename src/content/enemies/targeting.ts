import type { State as BattleState } from "../../core/battle/state.js";
import type { Ref } from "../../core/common/ref.js";
import * as targeting from "../../core/battle/targeting/index.js";
import * as units from "../../core/unit/index.js";
import type { Classification } from "../../core/unit/capability/classification/index.js";
import type { Blockable } from "../../core/unit/capability/blocking/index.js";
import { hasTargetable } from "../../core/unit/capability/targetable/capability.js";

export function selectBlocker(
    battle: BattleState,
    source: Ref<units.Unit & Classification & Blockable>,
) {
    const self = source.get(battle);
    if (self === undefined) {
        return { state: battle, value: [] };
    }

    const owner = self.blockable.relation?.blocker;
    const target = owner === undefined ? undefined : owner.get(battle);
    if (target === undefined || !hasTargetable(target)) {
        return { state: battle, value: [] };
    }

    const eligible = targeting.damage(self, () => true)(battle);

    return {
        state: battle,
        value: eligible(target) ? [units.ref(target)] : [],
    };
}
