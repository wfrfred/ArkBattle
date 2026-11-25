import { update } from "../../unit/operations.js";
import { TICKS_PER_SECOND } from "../../tick.js";
import * as units from "../../unit/query.js";
import * as effects from "../../effect/index.js";
import { ref } from "../../effect/effect.js";
import type { Unit } from "../../unit/unit.js";
import type { Definition as EffectDefinition } from "../../effect/definition.js";
import { stun } from "../control.js";
import { hasAction, type Action } from "../../unit/capability/action/capability.js";
import { beforeRelease } from "../../unit/capability/action/release.js";
import { setHook, removeHook } from "../../unit/hook.js";
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
        group: null,
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.NEURAL }),
        onInstall(battle, self) {
            battle = registerBurst(battle, self);
            const reference = ref(self);
            let host = availableHost(battle, reference);
            if (host === undefined) {
                return battle;
            }

            battle = effects.install(battle, self.ref.host, stun, {
                source: null,
                scopes: [],
                expiration: { type: "DEADLINE", tick: battle.tick + parameters.stunDurationTicks },
                enabled: true,
            }).state;
            host = availableHost(battle, reference);

            if (host !== undefined) {
                battle = hurt(battle, host, "TRUE", parameters.damage, "NONE", false);
            }

            return battle;
        },
        onTick: (battle, self) => advance(battle, self),
        onEnd,
    };
}

export function createParalysis(parameters: ParalysisParameters): Definition {
    const paralysis: EffectDefinition<{ used: number }, Unit & Action> = {
        id: "elemental/neural/paralysis",
        group: null,
        initialize: () => ({ used: 0 }),
        onInstall(battle, self) {
            const reference = ref(self);

            return update(
                battle,
                self.ref.host,
                setHook(beforeRelease, {
                    id: `@effect/${self.id}/paralysis`,
                    priority: 0,
                    accepts(current) {
                        const active = reference.get(current);

                        return (
                            active?.lifecycle === "ACTIVE" &&
                            active.state.used < parameters.paralysisStacks
                        );
                    },
                    invoke(current) {
                        const active = reference.get(current)!;
                        const used = active.state.used + 1;
                        current = effects.setState(current, reference, { used });

                        if (used === parameters.paralysisStacks) {
                            current = effects.remove(current, reference);
                        }

                        const recoveryTicks = TICKS_PER_SECOND / 2;
                        const host = self.ref.host.get(current);
                        if (host?.lifecycle === "ACTIVE") {
                            current = effects.install(current, self.ref.host, stun, {
                                source: null,
                                scopes: [],
                                expiration: {
                                    type: "DEADLINE",
                                    tick: current.tick + recoveryTicks,
                                },
                                enabled: true,
                            }).state;
                        }

                        return { state: current, value: { type: "INTERRUPT", recoveryTicks } };
                    },
                }),
            );
        },
        onEnd: (battle, self) =>
            update(
                battle,
                self.ref.host,
                removeHook(beforeRelease, `@effect/${self.id}/paralysis`),
            ),
    };

    return {
        id: "elemental/neural-paralysis/burst",
        group: null,
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
                const existing = effects
                    .forHost(battle, units.ref(host))
                    .map((effect) => effects.get(battle, ref(effect), paralysis))
                    .find((effect) => effect !== undefined && effect.lifecycle !== "ENDING");
                battle =
                    existing === undefined
                        ? effects.install(battle, units.ref(host), paralysis, {
                              source: null,
                              scopes: [],
                              expiration: { type: "INFINITE" },
                              enabled: true,
                          }).state
                        : effects.setState(battle, ref(existing), { used: 0 });
            }

            host = availableHost(battle, reference);

            if (host !== undefined) {
                battle = hurt(battle, host, "ELEMENTAL", parameters.damage, "NORMAL", false);
            }

            return battle;
        },
        onTick: (battle, self) => advance(battle, self),
        onEnd,
    };
}
