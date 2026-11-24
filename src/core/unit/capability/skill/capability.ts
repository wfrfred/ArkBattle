import type { Unit } from "../../unit.js";
import { ref, type Ref } from "../../../common/ref.js";
import type * as contribution from "../../../common/contribution.js";
import * as entries from "../../../common/collection/entries.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Skill as SkillState } from "./skill.js";
import type { Definition as SkillDefinition } from "./definition.js";
import { initialize as initializeSkill } from "./initialize.js";
import type { Input as AmmoInput } from "./ammo.js";
import type { RecoveryRestriction, Restrictions } from "./restriction.js";
import { createChange, type Change } from "../../change.js";
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
    readonly nextActivationId: number;
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
        nextActivationId: 0,
        ammo: [],
        activationRestrictions: [],
        operationRestrictions: [],
        recoveryRestrictions: [
            {
                id: "@skill/active-recovery",
                value: activeRecoveryRestriction,
            },
        ],
    };

    return {
        state: initialized.state,
        value: { ...unit, skill: value, hooks: unit.hooks.set(enteredKey, entered) },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Skill,
    "skill",
    keyof Restrictions
>("skill");

export function setAmmoContribution(
    entry: contribution.Contribution<AmmoInput>,
): Change<Unit & Skill> {
    return createChange<Unit & Skill>((self) => {
        const ammo = entries.set(self.skill.ammo, entry);

        return ammo === self.skill.ammo ? self : { ...self, skill: { ...self.skill, ammo } };
    });
}

export function removeAmmoContribution(id: string): Change<Unit & Skill> {
    return createChange<Unit & Skill>((self) => {
        const ammo = entries.remove(self.skill.ammo, id);

        return ammo === self.skill.ammo ? self : { ...self, skill: { ...self.skill, ammo } };
    });
}
