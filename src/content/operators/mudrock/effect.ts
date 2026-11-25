import * as unitHooks from "../../../core/unit/hook.js";
import {
    hasClassification,
    hasFilterTag,
} from "../../../core/unit/capability/classification/index.js";
import { update as updateUnit, ref as unitRef, type Unit } from "../../../core/unit/index.js";
import { blocked } from "../../../core/battle/blocking/index.js";
import { hasBlocker } from "../../../core/unit/capability/blocking/index.js";
import { hasSkill, modify } from "../../../core/unit/capability/skill/index.js";
import type { Vitality } from "../../../core/unit/capability/vitality/index.js";
import { cancel, receiving } from "../../../core/battle/resource/hp/damage/index.js";
import {
    type Definition as EffectDefinition,
    forHost,
    ref as effectRef,
    setState,
} from "../../../core/effect/index.js";
import type { State as BattleState } from "../../../core/battle/index.js";
import type { Ref } from "../../../core/common/ref.js";
import { healSelf } from "./common.js";

interface ShieldState {
    readonly layers: number;
    readonly timer: number;
    readonly lastTick: number;
}

export interface ShieldParameters {
    readonly interval: number;
    readonly initialLayers: number;
    readonly capacity: number;
    readonly healRatio: number;
    readonly extraSp: number;
    readonly sarkazResistance: number;
    readonly blockedDamageScale: number;
}

const SHIELD_ID = "mudrock/shield";

export function readShield(
    battle: BattleState,
    host: Ref<Unit>,
): { readonly layers: number; readonly timer: number } | undefined {
    const effect = forHost(battle, host).find((entry) => entry.definition.id === SHIELD_ID);
    if (effect?.lifecycle !== "ACTIVE") {
        return undefined;
    }

    const { layers, timer } = effect.state as ShieldState;

    return { layers, timer };
}

function hasSarkazTag(unit: Unit | undefined): boolean {
    return unit !== undefined && hasClassification(unit) && hasFilterTag(unit, "sarkaz");
}

export function shieldEffect({
    interval,
    initialLayers,
    capacity,
    healRatio,
    extraSp,
    sarkazResistance,
    blockedDamageScale,
}: ShieldParameters): EffectDefinition<ShieldState, Unit & Vitality> {
    const definition: EffectDefinition<ShieldState, Unit & Vitality> = {
        id: SHIELD_ID,
        initialize: (state) => ({ layers: initialLayers, timer: interval, lastTick: state.tick }),
        onEnable: (state, self) => {
            const unit = self.ref.host.get(state);
            if (unit === undefined) {
                return state;
            }

            const ref = effectRef(self);

            return updateUnit(
                state,
                unitRef(unit),
                unitHooks.setHook(receiving, {
                    id: `${SHIELD_ID}/${self.id}`,
                    priority: 100,
                    accepts: (_battle, { request }) => request.nature !== "LOSS",
                    invoke(state, context, pending) {
                        const shield = ref.get(state);
                        const host = self.ref.host.get(state);
                        if (
                            pending.type === "CANCELLED" ||
                            pending.amount <= 0 ||
                            shield?.lifecycle !== "ACTIVE" ||
                            host === undefined
                        ) {
                            return { state, value: pending };
                        }

                        const received =
                            shield.state.layers > 0
                                ? cancel(pending, "BLOCKED", context.forbidden)
                                : pending;
                        if (received.type === "CANCELLED") {
                            state = setState(state, ref, {
                                ...shield.state,
                                layers: shield.state.layers - 1,
                            });
                            state = healSelf(state, self.ref.host, healRatio);
                            const current = self.ref.host.get(state);
                            if (current !== undefined && hasSkill(current)) {
                                state = modify(state, unitRef(current), extraSp).state;
                            }

                            return {
                                state,
                                value: received,
                            };
                        }

                        if (pending.type === "FIXED") {
                            return { state, value: pending };
                        }

                        const source = context.request.source;
                        const sarkazScale = hasSarkazTag(source?.get(state))
                            ? 1 - sarkazResistance
                            : 1;
                        const blockingScale =
                            source !== null &&
                            hasBlocker(host) &&
                            blocked(state, unitRef(host)).some((ref) => ref === source)
                                ? blockedDamageScale
                                : 1;

                        return {
                            state,
                            value: {
                                ...pending,
                                amount: pending.amount * sarkazScale * blockingScale,
                            },
                        };
                    },
                }),
            );
        },
        onDisable: (state, self) => {
            const unit = self.ref.host.get(state);

            return unit === undefined
                ? state
                : updateUnit(
                      state,
                      unitRef(unit),
                      unitHooks.removeHook(receiving, `${SHIELD_ID}/${self.id}`),
                  );
        },
        onTick(state, self) {
            const elapsed = state.tick - self.state.lastTick;
            if (elapsed <= 0) {
                return state;
            }

            const remaining = self.state.timer - elapsed;
            const pulses = remaining <= 0 ? Math.floor(-remaining / interval) + 1 : 0;

            return setState(state, effectRef(self), {
                ...self.state,
                layers: Math.min(capacity, self.state.layers + pulses),
                timer: remaining + pulses * interval,
                lastTick: state.tick,
            });
        },
    };

    return definition;
}
