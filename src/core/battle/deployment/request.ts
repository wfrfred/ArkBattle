import type { Contribution } from "../../common/contribution.js";
import type { Ref } from "../../common/ref.js";
import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { Direction } from "../../geometry/direction.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import type { Hooks } from "../../hook.js";
import { validateRestrictions } from "../../restriction.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import type { Card } from "./card/card.js";
import type { Restriction } from "./restriction.js";

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
    readonly restrictions: readonly Contribution<Restriction>[];
    readonly hooks: Hooks;
}

export interface RedeployRequest {
    readonly unit: Ref<Unit & Deployable>;
    readonly tilePosition: TilePosition;
    readonly direction: Direction | null;
    readonly kind: "SELF" | "EXTERNAL";
}

export function validateRequest({ quote, restrictions }: DeployRequest): void {
    if (quote.dp !== null) {
        assertNonnegativeNumber(quote.dp, "deployment payment");
    }

    assertNonnegativeSafeInteger(quote.stock, "deployment stock consumption");
    assertNonnegativeSafeInteger(quote.slots, "deployment slot consumption");
    validateRestrictions(restrictions);
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
