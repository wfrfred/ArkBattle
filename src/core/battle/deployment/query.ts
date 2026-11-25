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
import { resolveCost } from "./deck/card/dp/query.js";
import { isReady, resolveActiveLimit } from "./deck/card/supply/query.js";
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
    return battle.deployment.history.find(({ unit }) => unit === reference)?.card ?? null;
}

export function sourceIdentity(
    battle: BattleState,
    source: Ref<Unit> | null,
): Ref<Unit> | Ref<Card> | null {
    return source === null ? null : (cardForUnit(battle, source) ?? source);
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

export function createRequest<T extends Card<any>>(
    battle: BattleState,
    reference: Ref<T>,
    tilePosition: TilePosition,
    direction: Direction | null,
): DeployRequest<T> | undefined {
    const self: Card | undefined = reference.get(battle);
    if (self === undefined) {
        return undefined;
    }

    return {
        card: reference,
        tilePosition,
        direction,
        quote: {
            dp: resolveCost(battle, self),
            stock: 1,
            slots: self.definition.slot,
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
            group: null,
            value: {
                allows: (battle, { request }) => isReady(request.card.get(battle)!),
            },
        },
    ],
    [
        "ACTIVE_LIMIT",
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
    ],
    [
        "SLOT_LIMIT",
        {
            id: "@deployment/slots",
            group: null,
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
            group: null,
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
    self: Card,
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
    const self = request.card.get(battle)!;
    if (self.supply.stock < request.quote.stock) {
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

    const self = input.card.get(battle);
    if (self === undefined) {
        return { type: "REJECTED", reason: "UNKNOWN_CARD" };
    }

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

    const self = input.card.get(battle);
    if (self === undefined) {
        return { type: "REJECTED", reason: "UNKNOWN_CARD" };
    }

    const rejected = evaluateCurrent(battle, input, resolveRestrictions(self, input));
    if (rejected !== null) {
        return rejected;
    }

    return {
        type: "ALLOWED",
        cost: resolveCost(battle, self),
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
    const self = input.card.get(battle);
    if (self === undefined) {
        return result;
    }

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
