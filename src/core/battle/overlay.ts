import { createRef, type Ref } from "../common/ref.js";
import { replaceIn } from "../common/object.js";
import type { Input, Overlay } from "../battlefield/navigation/overlay.js";
import {
    setOverlay,
    removeOverlay,
    type MotionMode,
    type State as NavigationState,
} from "../battlefield/navigation/state.js";
import type { State as BattleState, Result } from "./state.js";

export type { Input, Overlay } from "../battlefield/navigation/overlay.js";

const modes = ["WALK", "FLY"] as const;

function getOverlay(this: object, battle: BattleState): Overlay | undefined {
    const { overlays } = battle.battlefield.navigation;

    return (
        overlays.WALK.find(({ ref }) => ref === this) ??
        overlays.FLY.find(({ ref }) => ref === this)
    );
}

export function create(battle: BattleState, mode: MotionMode, input: Input): Result<Ref<Overlay>> {
    const id = battle.execution.nextOverlayId;
    const reference = createRef<Overlay>({ id }, getOverlay);
    const navigation = setOverlay(battle.battlefield.navigation, mode, {
        ...input,
        id,
        ref: reference,
    });

    return {
        state: {
            ...battle,
            execution: { ...battle.execution, nextOverlayId: id + 1 },
            battlefield: { ...battle.battlefield, navigation },
        },
        value: reference,
    };
}

export function update(battle: BattleState, reference: Ref<Overlay>, input: Input): BattleState {
    const current = battle.battlefield.navigation;
    const mode = modeOf(current, reference);
    if (mode === undefined) {
        throw new RangeError(`unknown navigation overlay: ${reference.id}`);
    }

    const navigation = setOverlay(current, mode, { ...input, id: reference.id, ref: reference });

    return replaceIn(battle, ["battlefield", "navigation"], navigation);
}

export function remove(battle: BattleState, reference: Ref<Overlay>): BattleState {
    const current = battle.battlefield.navigation;
    const mode = modeOf(current, reference);
    if (mode === undefined) {
        return battle;
    }

    const navigation = removeOverlay(current, mode, reference);

    return replaceIn(battle, ["battlefield", "navigation"], navigation);
}

function modeOf(state: NavigationState, reference: Ref<Overlay>): MotionMode | undefined {
    return modes.find((mode) => state.overlays[mode].some(({ ref }) => ref === reference));
}
