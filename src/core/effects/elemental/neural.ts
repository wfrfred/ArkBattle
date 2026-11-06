import { update } from "../../battle/unit.js";
import { TICKS_PER_SECOND } from "../../tick.js";
import * as units from "../../unit/query.js";
import * as effects from "../../unit/effect/operations.js";
import { ref, type Effect } from "../../unit/effect/effect.js";
import type { Definition as EffectDefinition } from "../../unit/effect/definition.js";
import { stun } from "../control.js";
import {
    hasAction,
    setHook,
    removeHook,
    type Action,
} from "../../unit/capability/action/capability.js";
import { Type } from "../../unit/capability/elemental/capability.js";
import { hurt } from "./damage.js";
import {
    availableHost,
    advance,
    onInstall as registerBurst,
    onEnd,
    type Definition,
} from "../../unit/capability/elemental/burst.js";

export interface StunParameters {
    readonly durationTicks: number;
    readonly stunDurationTicks: number;
    readonly damage: number;
}

export interface ParalysisParameters {
    readonly durationTicks: number;
    readonly damage: number;
    readonly paralysisStacks: number;
}

export function createStun(parameters: StunParameters): Definition {
    return {
        id: "elemental/neural-stun/burst",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.NEURAL }),
        onInstall(battle, self) {
            battle = registerBurst(battle, self);
            const reference = ref(self);
            let host = availableHost(battle, reference);
            if (host === undefined) {
                return battle;
            }

            battle = effects.install(battle, self.host, stun, {
                expiration: { type: "DEADLINE", tick: battle.tick + parameters.stunDurationTicks },
            }).state;
            host = availableHost(battle, reference);

            if (host !== undefined) {
                battle = hurt(battle, host, "TRUE", parameters.damage);
            }

            return battle;
        },
        onTick: (battle, self) => advance(battle, self),
        onEnd,
    };
}

export function createParalysis(parameters: ParalysisParameters): Definition {
    const paralysis: EffectDefinition<{ used: number }, Action> = {
        id: "elemental/neural/paralysis",
        initialize: () => ({ used: 0 }),
        onInstall(battle, self) {
            const effectId = self.id;

            return update(
                battle,
                self.host,
                setHook("beforeRelease", {
                    id: `@effect/${effectId}/paralysis`,
                    accepts(current) {
                        const active = units
                            .get(current, self.host)
                            ?.effects.get(effectId, paralysis);

                        return (
                            active?.status === "ACTIVE" &&
                            active.state.used < parameters.paralysisStacks
                        );
                    },
                    invoke(current) {
                        const active = units
                            .get(current, self.host)!
                            .effects.get(effectId, paralysis)!;
                        const reference = ref(active);
                        const used = active.state.used + 1;
                        current = effects.setState(current, reference, { used });

                        if (used === parameters.paralysisStacks) {
                            current = effects.end(current, reference);
                        }

                        const recoveryTicks = TICKS_PER_SECOND / 2;
                        const host = units.get(current, self.host);
                        if (host?.lifecycle === "PRESENT") {
                            current = effects.install(current, self.host, stun, {
                                expiration: {
                                    type: "DEADLINE",
                                    tick: current.tick + recoveryTicks,
                                },
                            }).state;
                        }

                        return { state: current, value: { type: "INTERRUPT", recoveryTicks } };
                    },
                }),
            );
        },
        onEnd: (battle, self) =>
            update(battle, self.host, removeHook("beforeRelease", `@effect/${self.id}/paralysis`)),
    };

    return {
        id: "elemental/neural-paralysis/burst",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.NEURAL }),
        onInstall(battle, self) {
            battle = registerBurst(battle, self);
            const reference = ref(self);
            let host = availableHost(battle, reference);
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
                        : effects.setState(
                              battle,
                              ref(existing as Effect<{ used: number }, Action>),
                              {
                                  used: 0,
                              },
                          );
            }

            host = availableHost(battle, reference);

            if (host !== undefined) {
                battle = hurt(battle, host, "ELEMENTAL", parameters.damage);
            }

            return battle;
        },
        onTick: (battle, self) => advance(battle, self),
        onEnd,
    };
}
