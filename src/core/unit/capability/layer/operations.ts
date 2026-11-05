import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";
import { ref } from "../../query.js";
import type { Unit } from "../../unit.js";
import { hasBlocker } from "../blocking/blocker.js";
import { releaseCaptured } from "../blocking/blocker-operations.js";
import { hasBlockable } from "../blocking/blockable.js";
import { release } from "../blocking/blockable-operations.js";
import type { Layer, Type } from "./capability.js";

export function setType(reference: Ref<Unit & Layer>, type: Type): Change {
    return createChange(
        reference,
        (unit) => ({ ...unit, layer: { type } }),
        (battle, previous) => {
            if (hasBlocker(previous)) {
                return releaseCaptured(battle, previous);
            }
            if (hasBlockable(previous)) {
                return release(battle, ref(previous));
            }

            return battle;
        },
    );
}
