import type { Rule as BaseRule } from "../../../rule.js";
import type { Unit } from "../../unit.js";
import type { Blocker } from "./blocker.js";
import type { Blockable } from "./blockable.js";
import { hasAllegiance, type Side } from "../allegiance/capability.js";

export interface RuleContext {
    readonly blocker: Unit & Blocker;
    readonly blockable: Unit & Blockable;
}

export type Rule = BaseRule<RuleContext>;

export function sides(...sides: readonly Side[]): Rule {
    return {
        id: "blocking/sides",
        allows: (_battle, { blockable }) =>
            hasAllegiance(blockable) && sides.includes(blockable.allegiance.side),
    };
}
