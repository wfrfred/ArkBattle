import { resolveEntries, type Contribution } from "../../common/contribution.js";
import type { Ref } from "../../common/ref.js";
import type { Direction } from "../../geometry/direction.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import { at } from "../../battlefield/occupancy.js";
import { get as getTile } from "../../battlefield/map/map.js";
import { hasDeployable } from "../../unit/capability/deployable/capability.js";
import type { State as BattleState } from "../state.js";
import type { Unit } from "../../unit/unit.js";
import type { Card } from "./deck/card/card.js";
import { get } from "./deck/deck.js";
import { advanceCard, resolveCost } from "./deck/operations.js";
import type { Restriction as CardRestriction } from "./deck/card/restriction.js";
import type { Restriction } from "./restriction.js";
import {
    validateRequest,
    type DeployRequest,
    type Quote,
    type Rejected,
    type Rejection,
} from "./request.js";
import { canPay } from "./dp/query.js";
import { remaining } from "./slot/query.js";
import { Hooks } from "../../hook.js";

export function cardForUnit(battle: BattleState, reference: Ref<Unit>): Ref<Card> | null {
    return battle.deployment.history.find(({ unit }) => unit.id === reference.id)?.card ?? null;
}

export function deployedCount(battle: BattleState, reference: Ref<Card<any>>): number {
    let count = 0;

    for (const unit of battle.battlefield.units.values()) {
        if (hasDeployable(unit) && unit.deployable.card?.id === reference.id) {
            count++;
        }
    }

    return count;
}

export function createRequest<T extends Card<any>>(
    battle: BattleState,
    reference: Ref<T>,
    tilePosition: TilePosition,
    direction?: Direction,
): DeployRequest<T> | undefined {
    const self = get(battle, reference);
    if (self === undefined) {
        return undefined;
    }

    return {
        card: reference,
        tilePosition,
        ...(direction === undefined ? {} : { direction }),
        quote: {
            dp: resolveCost(battle, self),
            stock: 1,
            slots: self.definition.slots,
        },
        restrictions: [],
        hooks: Hooks.empty(),
    };
}

const defaults: readonly [Rejection, Contribution<Restriction>][] = [
    [
        "COOLDOWN",
        {
            id: "@deployment/cooldown",
            value: {
                allows: (battle, { request }) => get(battle, request.card)!.cooldown === null,
            },
        },
    ],
    [
        "ACTIVE_LIMIT",
        {
            id: "@deployment/active-limit",
            value: {
                allows: (battle, { request }) => {
                    const limit = get(battle, request.card)!.definition.activeLimit;

                    return limit === null || deployedCount(battle, request.card) < limit;
                },
            },
        },
    ],
    [
        "SLOT_LIMIT",
        {
            id: "@deployment/slots",
            value: {
                allows: (battle, { request }) => {
                    const available = remaining(battle);

                    return available === null || request.quote.slots <= available;
                },
            },
        },
    ],
    [
        "RULE",
        {
            id: "@deployment/placement",
            value: {
                allows: (battle, { request }) =>
                    getTile(battle.battlefield.map, request.tilePosition)!.state.placement !==
                    "NONE",
            },
        },
    ],
];

export const defaultRestrictions: readonly Contribution<Restriction>[] = defaults.map(
    ([, entry]) => entry,
);

export function resolveRestrictions(
    self: Card<any>,
    request: DeployRequest,
): readonly Contribution<Restriction | CardRestriction>[] {
    const restrictions = new Map<string, Contribution<Restriction | CardRestriction>>();

    for (const entry of [
        ...defaultRestrictions,
        ...self.definition.deploymentRestrictions,
        ...self.restrictions,
        ...request.restrictions,
    ]) {
        restrictions.set(entry.id, entry);
    }

    return resolveEntries([...restrictions.values()]);
}

export function evaluateCurrent(
    battle: BattleState,
    request: DeployRequest,
    restrictions: readonly Contribution<Restriction | CardRestriction>[],
): Rejected | null {
    const self = get(battle, request.card)!;
    if (self.stock < request.quote.stock) {
        return { type: "REJECTED", reason: "NO_STOCK" };
    }
    if (request.quote.dp !== null && !canPay(battle.deployment.dp, request.quote.dp)) {
        return { type: "REJECTED", reason: "INSUFFICIENT_DP" };
    }

    if (getTile(battle.battlefield.map, request.tilePosition) === undefined) {
        return { type: "REJECTED", reason: "OUTSIDE_MAP" };
    }

    const slot = self.unitDefinition.occupancy.slot;
    const occupancy = at(battle.battlefield, request.tilePosition);
    if ((slot === "SUPPORT" ? occupancy?.support : occupancy?.occupant) != null) {
        return { type: "REJECTED", reason: "OCCUPIED" };
    }

    const context = { purpose: "DEPLOY" as const, request };

    for (const entry of restrictions) {
        if (!entry.value.allows(battle, context)) {
            return {
                type: "REJECTED",
                reason: defaults.find(([, candidate]) => candidate.id === entry.id)?.[0] ?? "RULE",
            };
        }
    }

    return null;
}

export function evaluate<T extends Card<any>>(
    battle: BattleState,
    request: DeployRequest<T>,
): Rejected | null {
    const input = request as object as DeployRequest;
    validateRequest(input);

    const self = get(battle, input.card);
    if (self === undefined) {
        return { type: "REJECTED", reason: "UNKNOWN_CARD" };
    }

    battle = advanceCard(battle, self);

    return evaluateCurrent(battle, input, resolveRestrictions(self, input));
}

export function preview<T extends Card<any>>(
    battle: BattleState,
    request: DeployRequest<T>,
):
    | Rejected
    | {
          readonly type: "ALLOWED";
          readonly cost: number;
          readonly quote: Quote;
      } {
    const input = request as object as DeployRequest;
    validateRequest(input);

    const self = get(battle, input.card);
    if (self === undefined) {
        return { type: "REJECTED", reason: "UNKNOWN_CARD" };
    }

    battle = advanceCard(battle, self);
    const rejected = evaluateCurrent(battle, input, resolveRestrictions(self, input));
    if (rejected !== null) {
        return rejected;
    }

    return {
        type: "ALLOWED",
        cost: resolveCost(battle, get(battle, request.card)!),
        quote: request.quote,
    };
}

export function positions<T extends Card<any>>(
    battle: BattleState,
    request: DeployRequest<T>,
): readonly TilePosition[] {
    const input = request as object as DeployRequest;
    validateRequest(input);

    const result: TilePosition[] = [];
    const self = get(battle, input.card);
    if (self === undefined) {
        return result;
    }

    battle = advanceCard(battle, self);
    const restrictions = resolveRestrictions(self, input);
    const { rows, columns } = battle.battlefield.map;

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const tilePosition: TilePosition = [row, column];
            if (evaluateCurrent(battle, { ...input, tilePosition }, restrictions) === null) {
                result.push(tilePosition);
            }
        }
    }

    return result;
}
