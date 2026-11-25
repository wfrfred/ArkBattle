import { update } from "../../unit/operations.js";
import { TICKS_PER_SECOND } from "../../tick.js";
import type { Duration } from "../../effect/expiration.js";
import { silence, blockSpRecovery } from "../control.js";
import * as modifier from "../../common/modifier.js";
import * as effects from "../../effect/operations.js";
import * as units from "../../unit/query.js";
import { modify } from "../../unit/capability/skill/sp.js";
import {
    hasOffense,
    setAttackContribution,
    removeAttackContribution,
} from "../../unit/capability/offense/capability.js";
import { hasSkill } from "../../unit/capability/skill/capability.js";
import { Type } from "../../unit/capability/elemental/capability.js";
import { hurt } from "./damage.js";
import {
    create,
    availableHost,
    ref,
    type Definition,
    type State,
} from "../../unit/capability/elemental/burst.js";

export interface SpDrainParameters {
    readonly durationTicks: number;
    readonly damagePerSecond: number;
    readonly spDrainPerSecond: number;
}

export interface AttackReductionParameters {
    readonly durationTicks: number;
    readonly damagePerSecond: number;
    readonly attackReductionRatio: number;
}

function elapsedSeconds(expiration: Duration): number {
    return Math.floor((expiration.duration - expiration.remaining + 1e-8) / TICKS_PER_SECOND);
}

export function createSpDrain(parameters: SpDrainParameters): Definition {
    return create<State>({
        id: "elemental/necrosis/sp-drain",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.NECROSIS }),
        onInstall(battle, self) {
            const reference = ref(self);
            const scopes = [reference];

            for (const control of [silence, blockSpRecovery]) {
                if (availableHost(battle, reference) === undefined) {
                    return battle;
                }

                battle = effects.install(battle, self.ref.host, control, {
                    source: null,
                    scopes,
                    expiration: { type: "INFINITE" },
                    enabled: true,
                }).state;
            }

            return battle;
        },
        onTick(battle, self, previous) {
            const reference = ref(self);
            const last = elapsedSeconds(self.expiration);

            for (let second = elapsedSeconds(previous) + 1; second <= last; second++) {
                const host = availableHost(battle, reference);
                if (host === undefined) {
                    return battle;
                }

                if (hasSkill(host)) {
                    battle = modify(
                        battle,
                        units.ref(host),
                        -parameters.spDrainPerSecond,
                        false,
                    ).state;
                }

                const unit = availableHost(battle, reference);

                if (unit === undefined) {
                    return battle;
                }

                battle = hurt(battle, unit, "ARTS", parameters.damagePerSecond, "BUFF", false);
            }

            return battle;
        },
    });
}

export function createAttackReduction(parameters: AttackReductionParameters): Definition {
    return create<State>({
        id: "elemental/necrosis/attack-reduction",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.NECROSIS }),
        onEnable(battle, self) {
            const unit = self.ref.host.get(battle)!;

            return hasOffense(unit)
                ? update(
                      battle,
                      units.ref(unit),
                      setAttackContribution({
                          id: `@effect/${self.id}/attack`,
                          group: null,
                          value: [
                              modifier.create({
                                  finalScaler: 1 - parameters.attackReductionRatio,
                              }),
                          ],
                      }),
                  )
                : battle;
        },
        onDisable(battle, self) {
            const unit = self.ref.host.get(battle)!;

            return hasOffense(unit)
                ? update(
                      battle,
                      units.ref(unit),
                      removeAttackContribution(`@effect/${self.id}/attack`),
                  )
                : battle;
        },
        onTick(battle, self, previous) {
            const reference = ref(self);
            const last = elapsedSeconds(self.expiration);

            for (let second = elapsedSeconds(previous) + 1; second <= last; second++) {
                const host = availableHost(battle, reference);
                if (host === undefined) {
                    return battle;
                }

                battle = hurt(battle, host, "ELEMENTAL", parameters.damagePerSecond, "BUFF", false);
                const unit = availableHost(battle, reference);

                if (unit === undefined) {
                    return battle;
                }
                if (hasOffense(unit)) {
                    const scaler =
                        1 -
                        parameters.attackReductionRatio *
                            Math.max(0, 1 - second / (parameters.durationTicks / TICKS_PER_SECOND));
                    battle = update(
                        battle,
                        units.ref(unit),
                        setAttackContribution({
                            id: `@effect/${self.id}/attack`,
                            group: null,
                            value: [modifier.create({ finalScaler: scaler })],
                        }),
                    );
                }
            }

            return battle;
        },
    });
}
