import type { Contribution } from "../../common/contribution.js";
import type { Ref } from "../../common/ref.js";
import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { Direction } from "../../geometry/direction.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import type { Hooks } from "../../hook.js";
import { validateRestrictions } from "../../restriction.js";
import type { Card } from "./deck/card/card.js";
import type { Restriction } from "./restriction.js";

export interface Quote {
    readonly dp: number | null;
    readonly stock: number;
    readonly slots: number;
}

export interface DeployRequest<T extends Card<any> = Card> {
    readonly card: Ref<T>;
    readonly tilePosition: TilePosition;
    readonly direction: Direction | null;
    readonly quote: Quote;
    readonly restrictions: readonly Contribution<Restriction>[];
    readonly hooks: Hooks;
}

export function validateRequest({ quote, restrictions }: DeployRequest): void {
    if (quote.dp !== null) {
        assertNonnegativeNumber(quote.dp, "deployment payment");
    }

    assertNonnegativeSafeInteger(quote.stock, "deployment stock consumption");
    assertNonnegativeSafeInteger(quote.slots, "deployment slot consumption");
    validateRestrictions(restrictions);
}
