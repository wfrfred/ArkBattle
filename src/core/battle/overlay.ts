import { createRef, type Ref } from "../common/ref.js";
import { replaceIn } from "../common/object.js";
import type { Input, Overlay } from "../battlefield/navigation/overlay.js";
import { setOverlay, removeOverlay, type MotionMode } from "../battlefield/navigation/state.js";
import type { State as BattleState, Result } from "./state.js";

export type { Input, Overlay } from "../battlefield/navigation/overlay.js";

function getOverlay(this: object, battle: BattleState): Overlay | undefined {
    const reference = this as Ref<Overlay>;

    return battle.battlefield.navigation[reference.mode].overlays.find(
        ({ ref }) => ref === reference,
    );
}

export function create(battle: BattleState, mode: MotionMode, input: Input): Result<Ref<Overlay>> {
    const reference = createRef<Overlay>({ mode }, getOverlay);
    const navigation = setOverlay(battle.battlefield.navigation, {
        ...input,
        ref: reference,
    });

    return {
        state: replaceIn(battle, ["battlefield", "navigation"], navigation),
        value: reference,
    };
}

export function update(battle: BattleState, reference: Ref<Overlay>, input: Input): BattleState {
    if (reference.get(battle) === undefined) {
        throw new RangeError("unknown navigation overlay");
    }

    const navigation = setOverlay(battle.battlefield.navigation, {
        ...input,
        ref: reference,
    });

    return replaceIn(battle, ["battlefield", "navigation"], navigation);
}

export function remove(battle: BattleState, reference: Ref<Overlay>): BattleState {
    const navigation = removeOverlay(battle.battlefield.navigation, reference);

    return replaceIn(battle, ["battlefield", "navigation"], navigation);
}
