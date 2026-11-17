import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import type { Profession, ProfessionDefinition, SubProfession } from "./professions.js";

export type Side = "ALLY" | "ENEMY" | "NEUTRAL";

export const RANKS = ["NORMAL", "ELITE", "BOSS"] as const;

export type Rank = (typeof RANKS)[number];

export type Definition = {
    readonly side: Side;
} & (
    | (ProfessionDefinition & {
          readonly type: "OPERATOR";
          readonly extraProfessions: readonly Profession[];
          readonly groupTags: readonly string[];
      })
    | {
          readonly type: "SUMMON";
          readonly subProfession: SubProfession | null;
          readonly groupTags: readonly string[];
      }
    | {
          readonly type: "DEVICE";
          readonly filterTags: readonly string[];
          readonly groupTags: readonly string[];
      }
    | {
          readonly type: "ENEMY";
          readonly rank: Rank;
          readonly filterTags: readonly string[];
      }
);

export type Type = Definition["type"];

export interface State {}

export interface Classification<T extends Type = Type> {
    readonly definition: {
        readonly classification: Extract<Definition, { readonly type: T }>;
    };
    readonly classification: State;
}

export function hasClassification<U extends Unit>(unit: U): unit is U & Classification {
    return "classification" in unit && "classification" in unit.definition;
}

export function initialize<U extends Unit & Pick<Classification, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Classification> {
    return { state: battle, value: { ...unit, classification: {} } };
}
