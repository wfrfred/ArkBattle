import type { Result, State as BattleState } from "../../../battle/state.js";
import { assert, assertSafeInteger } from "../../../common/assert.js";
import type { Ref } from "../../../common/ref.js";
import { Vec2 } from "../../../common/vector.js";
import type { Unit } from "../../unit.js";
import { resolveMassLevel, type Shiftable } from "./shiftable.js";
import { resolveBaseForceLevel, type Shifter } from "./shifter.js";
import { applyImpulse, type Unbalance } from "./unbalance.js";

const PUSH_FORCES = [0, 100, 200, 400, 450, 530, 580] as const;
const PULL_FORCES = [0, 2, 10, 40, 42, 44, 46] as const;
const PUSH_IMPULSE_FACTOR = 0.02;

function index(
    battle: BattleState,
    source: Unit & Shifter,
    target: Unit & Shiftable,
    forceLevel: number,
): number {
    const level =
        forceLevel + resolveBaseForceLevel(battle, source) - resolveMassLevel(battle, target);

    return Math.max(0, Math.min(6, 3 + level));
}

export function resolvePullForce(
    battle: BattleState,
    source: Unit & Shifter,
    target: Unit & Shiftable,
    forceLevel: number,
): number {
    return PULL_FORCES[index(battle, source, target, forceLevel)]!;
}

export interface PushInput {
    readonly forceLevel: number;
    readonly direction: Vec2;
}

export function push(
    battle: BattleState,
    source: Ref<Unit & Shifter>,
    target: Ref<Unit & Shiftable>,
    input: PushInput,
): Result<Ref<Unbalance> | null> {
    assert(Vec2.is(input.direction), "push direction must be a finite vector", TypeError);
    assertSafeInteger(input.forceLevel, "force level");
    const applier = source.get(battle);
    const unit = target.get(battle);
    if (applier === undefined || unit === undefined) {
        return { state: battle, value: null };
    }

    const force = PUSH_FORCES[index(battle, applier, unit, input.forceLevel)]!;
    if (force === 0) {
        return { state: battle, value: null };
    }

    const length = Vec2.length(input.direction);
    const scale = force * PUSH_IMPULSE_FACTOR * battle.definition.pushMultiplier;
    const impulse = length === 0 ? input.direction : Vec2.scale(input.direction, scale / length);

    return applyImpulse(battle, target, impulse);
}
