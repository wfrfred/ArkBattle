import type { Restriction as BaseRestriction } from "../../../restriction.js";
import type { Unit } from "../../unit.js";
import type { Blocker } from "./blocker.js";
import type { Blockable } from "./blockable.js";
import { hasClassification, type Side } from "../classification/index.js";

export interface RestrictionContext {
    readonly blocker: Unit & Blocker;
    readonly blockable: Unit & Blockable;
}

export type Restriction = BaseRestriction<RestrictionContext>;

export function sides(...sides: readonly Side[]): Restriction {
    return {
        allows: (_battle, { blockable }) =>
            hasClassification(blockable) &&
            sides.includes(blockable.definition.classification.side),
    };
}
