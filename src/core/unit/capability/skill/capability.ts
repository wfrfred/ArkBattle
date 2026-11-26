import type { Unit } from "../../unit.js";
import { ref, type Ref } from "../../../common/ref.js";
import type * as contribution from "../../../common/contribution.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Skill as SkillState } from "./skill.js";
import type { Definition as SkillDefinition } from "./definition.js";
import { initialize as initializeSkill } from "./initialize.js";
import type { Input as AmmoInput } from "./ammo.js";
import type { RecoveryRestriction, Restrictions } from "./restriction.js";
import { createRegistrationOperations } from "../../registration.js";
import { entered } from "./operations.js";
import { entered as enteredKey } from "../../hook.js";

const activeRecoveryRestriction: RecoveryRestriction = {
    allows: (_battle, { self }) => self.skill.activation === null,
};

export interface Definition<H extends object = never> {
    readonly definition: SkillDefinition<any, any, H>;
}

export interface State extends SkillState, Restrictions {
    readonly activated: boolean;
    readonly ammo: readonly contribution.Contribution<AmmoInput>[];
}

export interface Skill<H extends object = never> {
    readonly definition: { readonly skill: Definition<H> };
    readonly skill: State;
}

export function hasSkill<U extends Unit>(unit: U): unit is U & Skill {
    return "skill" in unit && "skill" in unit.definition;
}

export function initialize<U extends Unit & Pick<Skill, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Skill> {
    const initialized = initializeSkill(
        battle,
        ref<Unit>(unit) as Ref<Unit & Skill>,
        unit.definition.skill.definition,
    );
    const skill = initialized.value;
    const value: State = {
        ...skill,
        activated: false,
        ammo: [],
        activationRestrictions: [],
        operationRestrictions: [],
        recoveryRestrictions: [
            {
                id: "@skill/active-recovery",
                group: null,
                value: activeRecoveryRestriction,
            },
        ],
    };

    return {
        state: initialized.state,
        value: { ...unit, skill: value, hooks: unit.hooks.set(enteredKey, entered) },
    };
}

const registration = createRegistrationOperations<Unit & Skill>();

export const { set: setRestriction, remove: removeRestriction } = registration<
    "skill",
    keyof Restrictions
>("skill");

export const { set: setAmmoContribution, remove: removeAmmoContribution } = registration(
    "skill",
    "ammo",
);
