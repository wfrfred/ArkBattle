import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../../battle/state.js";
import { get as getUnit } from "../query.js";
import { isSpatiallyPresent } from "../capability/presence/capability.js";
import type { View } from "./action.js";
import { end } from "./internal/end.js";

export function advance(battle: BattleState, reference: Ref<View>): BattleState {
    const source = getUnit(battle, reference.host);

    if (source === undefined) {
        return battle;
    }

    return (
        source.action.instances.read(reference.id, (self) => {
            if (self.status !== "RUNNING") {
                return battle;
            }

            if (source.lifecycle !== "PRESENT" || !isSpatiallyPresent(source)) {
                return end(battle, reference, { type: "CANCELLED", reason: "SOURCE_ABSENT" });
            }

            const advanced = self.definition.step(battle, self);

            return advanced.value
                ? end(advanced.state, reference, { type: "FINISHED" })
                : advanced.state;
        }) ?? battle
    );
}
