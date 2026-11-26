import { resolveEntries, type Contribution } from "../../common/contribution.js";
import type { Ref } from "../../common/ref.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import { at } from "../../battlefield/occupancy.js";
import { get as getTile } from "../../battlefield/map/map.js";
import { hasDeployable, type Deployable } from "../../unit/capability/deployable/capability.js";
import { allows } from "../../restriction.js";
import type { State as BattleState } from "../state.js";
import type { Unit } from "../../unit/unit.js";
import type { Card } from "./deck/card/card.js";
import { resolveCost } from "./deck/card/dp/query.js";
import { isReady, resolveActiveLimit } from "./deck/card/supply/query.js";
import type { Restriction as CardRestriction } from "./deck/card/restriction.js";
import type { Restriction } from "./restriction.js";
import { validateRequest, type DeployRequest, type Quote } from "./request.js";
import { canPay } from "./dp/query.js";
import { remaining } from "./slot/query.js";

export function cardForUnit(battle: BattleState, reference: Ref<Unit>): Ref<Card> | null {
    return battle.deployment.history.find(({ unit }) => unit === reference)?.card ?? null;
}

export function deployedCount<T extends Card<any>>(battle: BattleState, reference: Ref<T>): number {
    let count = 0;

    for (const unit of battle.battlefield.units.values()) {
        if (hasDeployable(unit) && unit.deployable.card === reference) {
            count++;
        }
    }

    return count;
}

export function canRetreat(battle: BattleState, reference: Ref<Unit & Deployable>): boolean {
    const self = reference.get(battle);

    return (
        self?.lifecycle === "ACTIVE" &&
        allows(battle, { self }, self.deployable.retreatRestrictions)
    );
}

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
                const limit = resolveActiveLimit(request.card.get(battle)!);

                return limit === null || deployedCount(battle, request.card) < limit;
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
): readonly Contribution<Restriction | CardRestriction>[] {
    const restrictions = new Map<string, Contribution<Restriction | CardRestriction>>();

    for (const entry of [
        ...defaultRestrictions,
        ...self.definition.deploymentRestrictions,
        ...self.restrictions,
        ...entries,
    ]) {
        restrictions.set(entry.id, entry);
    }

    return resolveEntries([...restrictions.values()]);
}

function evaluateCurrent(
    battle: BattleState,
    self: Card,
    request: DeployRequest,
    quote: Quote,
    restrictions: readonly Contribution<Restriction | CardRestriction>[],
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

    const context = { purpose: "DEPLOY" as const, request };

    return restrictions.every((entry) => entry.value.allows(battle, context));
}

export function evaluate<T extends Card<any>>(
    battle: BattleState,
    request: DeployRequest<T>,
): boolean {
    const input = request as object as DeployRequest;
    validateRequest(input);

    const self = input.card.get(battle);
    if (self === undefined) {
        return false;
    }

    const quote = input.quote ?? {
        dp: resolveCost(battle, self),
        stock: self.definition.supply.consumption,
        slots: self.definition.slot,
    };

    return evaluateCurrent(
        battle,
        self,
        input,
        quote,
        resolveRestrictions(self, input.restrictions),
    );
}

export function positions<T extends Card<any>>(
    battle: BattleState,
    reference: Ref<T>,
): readonly TilePosition[] {
    const result: TilePosition[] = [];
    const card = reference as object as Ref<Card>;
    const self = card.get(battle);
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
                card,
                tilePosition,
                direction: null,
                quote: null,
                restrictions: [],
            };
            if (evaluateCurrent(battle, self, request, quote, restrictions)) {
                result.push(tilePosition);
            }
        }
    }

    return result;
}
