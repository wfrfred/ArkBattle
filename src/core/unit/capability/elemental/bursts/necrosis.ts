import { update } from "../../../../battle/unit.js";
import { scope } from "../../../../lifetime/operations.js";
import { TICKS_PER_SECOND } from "../../../../tick.js";
import { silence, blockSpRecovery } from "../../../control.js";
import * as attribute from "../../../contribution/attribute.js";
import * as effects from "../../../effect/operations.js";
import * as units from "../../../query.js";
import { modify } from "../../../skill/sp.js";
import {
    hasOffense,
    setAttackContribution,
    removeAttackContribution,
} from "../../offense/capability.js";
import { hasSkill } from "../../skill/capability.js";
import { Type } from "../capability.js";
import {
    onInstall,
    advance,
    onEnd,
    activeHost,
    hurt,
    finishStart,
    ref,
    type Definition,
} from "../burst.js";

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
        initialize: () => ({ type: Type.NECROSIS, elapsedTicks: 0 }),
        onInstall,
        onEnable(battle, self) {
            const reference = ref(self);
            const scopes = [scope(effects.lifetime, reference)];

            for (const control of [silence, blockSpRecovery]) {
                if (activeHost(battle, reference) === undefined) {
                    return battle;
                }

                battle = effects.install(battle, self.host, control, { scopes }).state;
            }

            return finishStart(battle, self);
        },
        onTick: (battle, self) =>
            advance(battle, self, (current, host, reference) => {
                if (hasSkill(host)) {
                    current = modify(current, units.ref(host), -parameters.spDrainPerSecond).state;
                }

                const unit = activeHost(current, reference);

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
        initialize: () => ({ type: Type.NECROSIS, elapsedTicks: 0 }),
        onInstall,
        onEnable(battle, self) {
            const unit = activeHost(battle, ref(self));
            if (unit === undefined) {
                return battle;
            }
            if (hasOffense(unit)) {
                battle = update(battle, [
                    setAttackContribution(units.ref(unit), {
                        id: `@effect/${self.id}/attack`,
                        value: [
                            attribute.create({ finalScaler: 1 - parameters.attackReductionRatio }),
                        ],
                    }),
                ]);
            }

            return finishStart(battle, self);
        },
        onDisable(battle, self) {
            const unit = units.get(battle, self.host)!;

            return hasOffense(unit)
                ? update(battle, [
                      removeAttackContribution(units.ref(unit), `@effect/${self.id}/attack`),
                  ])
                : battle;
        },
        onTick: (battle, self) =>
            advance(battle, self, (current, host, reference, second) => {
                current = hurt(current, host, "ELEMENTAL", parameters.damagePerSecond);
                const unit = activeHost(current, reference);

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
