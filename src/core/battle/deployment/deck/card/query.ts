import { resolveEntries, type Contribution } from "../../../../common/contribution.js";
import type { Ref } from "../../../../common/ref.js";
import type { TilePosition } from "../../../../geometry/coordinate.js";
import { at } from "../../../../battlefield/occupancy.js";
import { get as getTile } from "../../../../battlefield/map/map.js";
import type { State as BattleState } from "../../../state.js";
import type { Card } from "./card.js";
import { resolveCost } from "./dp/query.js";
import { isReady, resolveActiveLimit } from "./supply/query.js";
import type { Restriction } from "./restriction.js";
import { validateRequest, type DeployRequest, type Quote } from "./request.js";
import { canPay } from "../../dp/query.js";
import { remaining } from "../../slot/query.js";

const defaultRestrictions: readonly Contribution<Restriction>[] = [
    {
        id: "@deployment/cooldown",
        group: null,
        value: {
            allows: (battle, { request }) => isReady(request.card.get(battle)!),
        },
    },
    {
        id: "@deployment/active-limit",
        group: null,
        value: {
            allows: (battle, { request }) => {
                const card = request.card.get(battle)!;
                const limit = resolveActiveLimit(card);

                return limit === null || card.units.length < limit;
            },
        },
    },
    {
        id: "@deployment/slots",
        group: null,
        value: {
            allows: (battle, { request }) => {
                const available = remaining(battle);
                const slots = request.quote?.slots ?? request.card.get(battle)!.definition.slot;

                return available === null || slots <= available;
            },
        },
    },
    {
        id: "@deployment/placement",
        group: null,
        value: {
            allows: (battle, { request }) =>
                getTile(battle.battlefield.map, request.tilePosition)!.state.placement !== "NONE",
        },
    },
];

function resolveRestrictions(
    self: Card,
    entries: readonly Contribution<Restriction>[],
): readonly Contribution<Restriction>[] {
    const restrictions = new Map<string, Contribution<Restriction>>();

    for (const entry of [
        ...defaultRestrictions,
        ...self.definition.restrictions,
        ...self.restrictions,
        ...entries,
    ]) {
        restrictions.set(entry.id, entry);
    }

    return resolveEntries([...restrictions.values()]);
}

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

    return allowsDeployment(
        battle,
        self,
        request,
        quote,
        resolveRestrictions(self, request.restrictions),
    );
}

export function positions(battle: BattleState, reference: Ref<Card>): readonly TilePosition[] {
    const result: TilePosition[] = [];
    const self = reference.get(battle);
    if (self === undefined) {
        return result;
    }

    const restrictions = resolveRestrictions(self, []);
    const quote: Quote = {
        dp: resolveCost(battle, self),
        stock: self.definition.supply.consumption,
        slots: self.definition.slot,
    };
    const { rows, columns } = battle.battlefield.map;

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const tilePosition: TilePosition = [row, column];
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
