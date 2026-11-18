import type * as contribution from "../../../common/contribution.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";
import type { Unit } from "../../unit.js";
import type { Skill } from "./capability.js";
import type { Source } from "./sp.js";

import type { Operation } from "./activation.js";

export interface ActivationContext {
    readonly self: Unit & Skill;
}

export interface OperationContext {
    readonly self: Unit & Skill;
    readonly operation: Operation;
}

export interface RecoveryContext {
    readonly self: Unit & Skill;
    readonly source: Source;
}

export type ActivationRestriction = BaseRestriction<ActivationContext>;

export type OperationRestriction = BaseRestriction<OperationContext>;

export type RecoveryRestriction = BaseRestriction<RecoveryContext>;

export interface Restrictions {
    readonly activationRestrictions: readonly contribution.Contribution<ActivationRestriction>[];
    readonly operationRestrictions: readonly contribution.Contribution<OperationRestriction>[];
    readonly recoveryRestrictions: readonly contribution.Contribution<RecoveryRestriction>[];
}
