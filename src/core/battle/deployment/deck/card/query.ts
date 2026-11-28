import { resolveEntries, type Contribution } from "../../../../common/contribution.js";
import { set } from "../../../../common/collection/entries.js";
import type { Ref } from "../../../../common/ref.js";
import type { TilePosition } from "../../../../geometry/coordinate.js";
import { at } from "../../../../battlefield/occupancy.js";
import { get as getTile } from "../../../../battlefield/map/map.js";
import type { State as BattleState } from "../../../state.js";
import type { Card } from "./card.js";
import { resolveCost } from "./dp/query.js";
import type { Restriction } from "./restriction.js";
import { validateRequest, type DeployRequest, type Quote } from "./request.js";
import { canPay } from "../../dp/query.js";

function allowsDeployment(
    battle: BattleState,
    self: Card,
    request: DeployRequest,
    quote: Quote,
    restrictions: readonly Contribution<Restriction>[],
): boolean {
    if (self.supply.stock < quote.stock) {
        return false;
    }
    if (quote.dp !== null && !canPay(battle.deployment.dp, quote.dp)) {
        return false;
    }

    if (getTile(battle.battlefield.map, request.tilePosition) === undefined) {
        return false;
    }

    const slot = self.unitDefinition.occupancy.slot;
    const occupancy = at(battle.battlefield, request.tilePosition);
    if ((slot === "SUPPORT" ? occupancy?.support : occupancy?.occupant) != null) {
        return false;
    }

    const context = { request };

    return restrictions.every((entry) => entry.value.allows(battle, context));
}

export function canDeploy(battle: BattleState, request: DeployRequest): boolean {
    validateRequest(request);

    const self = request.card.get(battle);
    if (self === undefined) {
        return false;
    }

    const quote = request.quote ?? {
        dp: resolveCost(battle, self),
        stock: self.definition.supply.consumption,
        slots: self.definition.slot,
    };

    const restrictions = resolveEntries(request.restrictions.reduce(set, self.restrictions));

    return allowsDeployment(battle, self, request, quote, restrictions);
}

export function positions(battle: BattleState, reference: Ref<Card>): readonly TilePosition[] {
    const result: TilePosition[] = [];
    const self = reference.get(battle);
    if (self === undefined) {
        return result;
    }

    const restrictions = resolveEntries(self.restrictions);
    const quote: Quote = {
        dp: resolveCost(battle, self),
        stock: self.definition.supply.consumption,
        slots: self.definition.slot,
    };
    const { rows, columns } = battle.battlefield.map;

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const tilePosition: TilePosition = [column, row];
            const request: DeployRequest = {
                card: reference,
                tilePosition,
                direction: null,
                quote: null,
                restrictions: [],
            };
            if (allowsDeployment(battle, self, request, quote, restrictions)) {
                result.push(tilePosition);
            }
        }
    }

    return result;
}
