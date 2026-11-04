import { update } from "../../battle/unit.js";
import { scope } from "../../lifetime/operations.js";
import { TICKS_PER_SECOND } from "../../tick.js";
import { silence, blockSpRecovery } from "../control.js";
import * as attribute from "../../unit/contribution/attribute.js";
import * as effects from "../../unit/effect/operations.js";
import * as units from "../../unit/query.js";
import { modify } from "../../unit/skill/sp.js";
import {
    hasOffense,
    setAttackContribution,
    removeAttackContribution,
} from "../../unit/capability/offense/capability.js";
import { hasSkill } from "../../unit/capability/skill/capability.js";
import { Type } from "../../unit/capability/elemental/capability.js";
import { hurt } from "./damage.js";
import {
    onInstall as registerBurst,
    advance,
    onEnd,
    availableHost,
    ref,
    type Definition,
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

export function createSpDrain(parameters: SpDrainParameters): Definition {
    return {
        id: "elemental/necrosis/sp-drain",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.NECROSIS }),
        onInstall(battle, self) {
            battle = registerBurst(battle, self);
            const reference = ref(self);
            const scopes = [scope(effects.lifetime, reference)];

            for (const control of [silence, blockSpRecovery]) {
                if (availableHost(battle, reference) === undefined) {
                    return battle;
                }

                battle = effects.install(battle, self.host, control, { scopes }).state;
            }

            return battle;
        },
        onTick: (battle, self, previousExpiration) =>
            advance(battle, self, previousExpiration, (current, host, reference) => {
                if (hasSkill(host)) {
                    current = modify(current, units.ref(host), -parameters.spDrainPerSecond).state;
                }

                const unit = availableHost(current, reference);

                if (unit === undefined) {
                    return current;
                }

                return hurt(current, unit, "ARTS", parameters.damagePerSecond);
            }),
        onEnd,
    };
}

export function createAttackReduction(parameters: AttackReductionParameters): Definition {
    return {
        id: "elemental/necrosis/attack-reduction",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.NECROSIS }),
        onInstall: registerBurst,
        onEnable(battle, self) {
            const unit = units.get(battle, self.host)!;

            return hasOffense(unit)
                ? update(battle, [
                      setAttackContribution(units.ref(unit), {
                          id: `@effect/${self.id}/attack`,
                          value: [
                              attribute.create({
                                  finalScaler: 1 - parameters.attackReductionRatio,
                              }),
                          ],
                      }),
                  ])
                : battle;
        },
        onDisable(battle, self) {
            const unit = units.get(battle, self.host)!;

            return hasOffense(unit)
                ? update(battle, [
                      removeAttackContribution(units.ref(unit), `@effect/${self.id}/attack`),
                  ])
                : battle;
        },
        onTick: (battle, self, previousExpiration) =>
            advance(battle, self, previousExpiration, (current, host, reference, second) => {
                current = hurt(current, host, "ELEMENTAL", parameters.damagePerSecond);
                const unit = availableHost(current, reference);

                if (unit === undefined) {
                    return current;
                }
                if (hasOffense(unit)) {
                    const scaler =
                        1 -
                        parameters.attackReductionRatio *
                            Math.max(0, 1 - second / (parameters.durationTicks / TICKS_PER_SECOND));
                    current = update(current, [
                        setAttackContribution(units.ref(unit), {
                            id: `@effect/${self.id}/attack`,
                            value: [attribute.create({ finalScaler: scaler })],
                        }),
                    ]);
                }

                return current;
            }),
        onEnd,
    };
}
