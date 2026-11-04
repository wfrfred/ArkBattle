import { update } from "../../../../battle/unit.js";
import { scope } from "../../../../lifetime/operations.js";
import { TICKS_PER_SECOND } from "../../../../tick.js";
import * as units from "../../../query.js";
import * as effects from "../../../effect/operations.js";
import { ref, type Effect } from "../../../effect/effect.js";
import type { Definition as EffectDefinition } from "../../../effect/definition.js";
import { stun } from "../../../control.js";
import { hasAction, setHook, removeHook, type Action } from "../../action/capability.js";
import { Type } from "../capability.js";
import {
    activeHost,
    advance,
    finishStart,
    hurt,
    onInstall,
    onEnd,
    type Definition,
} from "../burst.js";

export interface StunParameters {
    readonly durationTicks: number;
    readonly damage: number;
}

export interface ParalysisParameters extends StunParameters {
    readonly paralysisStacks: number;
}

export function createStun(parameters: StunParameters): Definition {
    return {
        id: "elemental/neural-stun/burst",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.NEURAL, elapsedTicks: 0 }),
        onInstall,
        onEnable(battle, self) {
            const reference = ref(self);
            let host = activeHost(battle, reference);
            if (host === undefined) {
                return battle;
            }

            battle = effects.install(battle, self.host, stun, {
                scopes: [scope(effects.lifetime, reference)],
            }).state;
            host = activeHost(battle, reference);

            if (host !== undefined) {
                battle = hurt(battle, host, "TRUE", parameters.damage);
            }

            return finishStart(battle, self);
        },
        onTick: advance,
        onEnd,
    };
}

export function createParalysis(parameters: ParalysisParameters): Definition {
    const paralysis: EffectDefinition<{ used: number }, Action> = {
        id: "elemental/neural/paralysis",
        initialize: () => ({ used: 0 }),
        onInstall(battle, self) {
            const effectId = self.id;

            return update(battle, [
                setHook(self.host, "beforeRelease", {
                    id: `@effect/${effectId}/paralysis`,
                    accepts(current) {
                        const active = units
                            .get(current, self.host)
                            ?.effects.get(effectId, paralysis);

                        return (
                            active?.status === "ACTIVE" &&
                            active.data.used < parameters.paralysisStacks
                        );
                    },
                    invoke(current) {
                        const active = units
                            .get(current, self.host)!
                            .effects.get(effectId, paralysis)!;
                        const reference = ref(active);
                        const used = active.data.used + 1;
                        current = effects.setData(current, reference, { used });

                        if (used === parameters.paralysisStacks) {
                            current = effects.end(current, reference);
                        }

                        const recoveryTicks = TICKS_PER_SECOND / 2;
                        const host = units.get(current, self.host);
                        if (host?.lifecycle === "PRESENT") {
                            current = effects.install(current, self.host, stun, {
                                deadline: current.tick + recoveryTicks,
                            }).state;
                        }

                        return { state: current, value: { type: "INTERRUPT", recoveryTicks } };
                    },
                }),
            ]);
        },
        onEnd: (battle, self) =>
            update(battle, [
                removeHook(self.host, "beforeRelease", `@effect/${self.id}/paralysis`),
            ]),
    };

    return {
        id: "elemental/neural-paralysis/burst",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.NEURAL, elapsedTicks: 0 }),
        onInstall,
        onEnable(battle, self) {
            const reference = ref(self);
            let host = activeHost(battle, reference);
            if (host === undefined) {
                return battle;
            }
            if (hasAction(host)) {
                const existing = host.effects
                    .values()
                    .find(
                        (effect) => effect.definition === paralysis && effect.status !== "ENDING",
                    );
                battle =
                    existing === undefined
                        ? effects.install(battle, units.ref(host), paralysis).state
                        : effects.setData(
                              battle,
                              ref(existing as Effect<{ used: number }, Action>),
                              {
                                  used: 0,
                              },
                          );
            }

            host = activeHost(battle, reference);

            if (host !== undefined) {
                battle = hurt(battle, host, "ELEMENTAL", parameters.damage);
            }

            return finishStart(battle, self);
        },
        onTick: advance,
        onEnd,
    };
}
