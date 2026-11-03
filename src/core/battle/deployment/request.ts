import type { Ref } from "../../common/ref.js";
import type { Direction } from "../../geometry/direction.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import type { Hooks } from "../../hook.js";
import type { Card } from "./card/card.js";
import type { Rule } from "./rule.js";

export interface Quote {
    readonly dp: number | null;
    readonly stock: number;
    readonly slots: number;
}

export interface DeployRequest<T extends Card<any> = Card> {
    readonly card: Ref<T>;
    readonly tilePosition: TilePosition;
    readonly direction?: Direction;
    readonly quote: Quote;
    readonly rules: readonly Rule[];
    readonly hooks: Hooks;
}

export type Rejection =
    | "UNKNOWN_CARD"
    | "NO_STOCK"
    | "COOLDOWN"
    | "ACTIVE_LIMIT"
    | "SLOT_LIMIT"
    | "INSUFFICIENT_DP"
    | "OUTSIDE_MAP"
    | "OCCUPIED"
    | "RULE";

export interface Rejected {
    readonly type: "REJECTED";
    readonly reason: Rejection;
}

export type DeployOutcome =
    { readonly type: "DEPLOYED"; readonly cardId: number; readonly unitId: number } | Rejected;
