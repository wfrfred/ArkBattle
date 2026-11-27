import type { Contribution } from "../../../../common/contribution.js";
import type { Ref } from "../../../../common/ref.js";
import {
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
} from "../../../../common/assert.js";
import type { Direction } from "../../../../geometry/direction.js";
import type { TilePosition } from "../../../../geometry/coordinate.js";
import { validateRestrictions } from "../../../../restriction.js";
import type { Card } from "./card.js";
import type { Restriction } from "./restriction.js";

export interface Quote {
    readonly dp: number | null;
    readonly stock: number;
    readonly slots: number;
}

export interface DeployRequest {
    readonly card: Ref<Card>;
    readonly tilePosition: TilePosition;
    readonly direction: Direction | null;
    readonly quote: Quote | null;
    readonly restrictions: readonly Contribution<Restriction>[];
}

export function validateRequest({ quote, restrictions }: DeployRequest): void {
    if (quote !== null) {
        if (quote.dp !== null) {
            assertNonnegativeNumber(quote.dp, "deployment payment");
        }

        assertNonnegativeSafeInteger(quote.stock, "deployment stock consumption");
        assertNonnegativeSafeInteger(quote.slots, "deployment slot consumption");
    }

    validateRestrictions(restrictions);
}
