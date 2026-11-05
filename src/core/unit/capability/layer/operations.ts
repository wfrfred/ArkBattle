import type { Ref } from "../../../common/ref.js";
import * as blocking from "../../../battle/blocking/operations.js";
import { createChange, type Change } from "../../change.js";
import { ref } from "../../query.js";
import type { Unit } from "../../unit.js";
import { hasBlocker } from "../blocking/blocker.js";
import { hasBlockable } from "../blocking/blockable.js";
import { release } from "../blocking/blockable-operations.js";
import type { Layer, Type } from "./capability.js";

export function setType(reference: Ref<Unit & Layer>, type: Type): Change {
    return createChange(
        reference,
        (unit) => ({ ...unit, layer: { type } }),
        (battle, previous) => {
            if (hasBlocker(previous)) {
                const blocker = ref(previous);

                return blocking.release(
                    battle,
                    previous.blocker.blocked.map((blocked) => ({ blocker, blocked })),
                );
            }
            if (hasBlockable(previous)) {
                return release(battle, ref(previous));
            }

            return battle;
        },
    );
}
