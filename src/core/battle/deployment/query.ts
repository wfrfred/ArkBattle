import type { Ref } from "../../common/ref.js";
import type { Direction } from "../../geometry/direction.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import { at } from "../../battlefield/occupancy.js";
import { get as getTile } from "../../battlefield/map/map.js";
import { hasDeployable } from "../../unit/capability/deployable/capability.js";
import type { State as BattleState } from "../state.js";
import type { Card } from "./card/card.js";
import { get } from "./card/query.js";
import { resolveCost } from "./card/state.js";
import type { Rule as CardRule } from "./card/rule.js";
import type { Rule } from "./rule.js";
import type { DeployRequest, Quote, Rejected, Rejection } from "./request.js";
import { advanceResources } from "./resources.js";
import { Hooks } from "../../hook.js";

export function usedSlots(battle: BattleState): number {
    return battle.deployment.usedSlots;
}

export function activeCount(battle: BattleState, reference: Ref<Card<any>>): number {
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
            dp: resolveCost(self, battle.deployment.definition.costCeiling ?? 99),
            stock: 1,
            slots: self.definition.card.slots,
        },
        rules: [],
        hooks: Hooks.empty(),
    };
}

const defaults: readonly [Rejection, Rule][] = [
    [
        "NO_STOCK",
        {
            id: "@deployment/stock",
            allows: (battle, { request }) =>
                get(battle, request.card)!.stock >= request.quote.stock,
        },
    ],
    [
        "COOLDOWN",
        {
            id: "@deployment/cooldown",
            allows: (battle, { request }) => get(battle, request.card)!.cooldown === null,
        },
    ],
    [
        "ACTIVE_LIMIT",
        {
            id: "@deployment/active-limit",
            allows: (battle, { request }) => {
                const limit = get(battle, request.card)!.definition.card.activeLimit;

                return limit === null || activeCount(battle, request.card) < limit;
            },
        },
    ],
    [
        "SLOT_LIMIT",
        {
            id: "@deployment/slots",
            allows: (battle, { request }) =>
                battle.deployment.definition.slotLimit === null ||
                battle.deployment.usedSlots + request.quote.slots <=
                    battle.deployment.definition.slotLimit,
        },
    ],
    [
        "INSUFFICIENT_DP",
        {
            id: "@deployment/dp",
            allows: (battle, { request }) =>
                request.quote.dp === null ||
                battle.deployment.dp - request.quote.dp >= battle.deployment.minDp,
        },
    ],
    [
        "OUTSIDE_MAP",
        {
            id: "@deployment/map",
            allows: (battle, { request }) => {
                const [row, column] = request.tilePosition;

                return (
                    Number.isInteger(row) &&
                    Number.isInteger(column) &&
                    row >= 0 &&
                    column >= 0 &&
                    row < battle.battlefield.map.rows &&
                    column < battle.battlefield.map.columns
                );
            },
        },
    ],
    [
        "OCCUPIED",
        {
            id: "@deployment/occupancy",
            allows: (battle, { request }) => {
                const slot = get(battle, request.card)!.definition.occupancy.slot;
                const occupancy = at(battle.battlefield, request.tilePosition);

                return slot === "SUPPORT"
                    ? occupancy?.support == null
                    : occupancy?.occupant == null;
            },
        },
    ],
    [
        "RULE",
        {
            id: "@deployment/placement",
            allows: (battle, { request }) =>
                getTile(battle.battlefield.map, request.tilePosition)?.state.placement !== "NONE",
        },
    ],
];

export const defaultRules: readonly Rule[] = defaults.map(([, rule]) => rule);

export function resolveRules(
    self: Card<any>,
    request: DeployRequest,
): readonly (Rule | CardRule)[] {
    const rules = new Map<string, Rule | CardRule>();

    for (const rule of [
        ...defaultRules,
        ...self.definition.card.deploymentRules,
        ...self.rules,
        ...request.rules,
    ]) {
        rules.set(rule.id, rule);
    }

    return [...rules.values()];
}

export function evaluateRules(
    battle: BattleState,
    request: DeployRequest,
    rules: readonly (Rule | CardRule)[],
): Rejected | null {
    const context = { purpose: "DEPLOY" as const, request };

    for (const rule of rules) {
        if (!rule.allows(battle, context)) {
            return {
                type: "REJECTED",
                reason: defaults.find(([, entry]) => entry.id === rule.id)?.[0] ?? "RULE",
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
    const self = get(battle, input.card);
    if (self === undefined) {
        return { type: "REJECTED", reason: "UNKNOWN_CARD" };
    }

    battle = advanceResources(battle, self);

    return evaluateRules(battle, input, resolveRules(self, input));
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
    const self = get(battle, input.card);
    if (self === undefined) {
        return { type: "REJECTED", reason: "UNKNOWN_CARD" };
    }

    battle = advanceResources(battle, self);
    const rejected = evaluateRules(battle, input, resolveRules(self, input));
    if (rejected !== null) {
        return rejected;
    }

    return {
        type: "ALLOWED",
        cost: resolveCost(
            get(battle, request.card)!,
            battle.deployment.definition.costCeiling ?? 99,
        ),
        quote: request.quote,
    };
}

export function positions<T extends Card<any>>(
    battle: BattleState,
    request: DeployRequest<T>,
): readonly TilePosition[] {
    const result: TilePosition[] = [];
    const input = request as object as DeployRequest;
    const self = get(battle, input.card);
    if (self === undefined) {
        return result;
    }

    battle = advanceResources(battle, self);
    const rules = resolveRules(self, input);
    const { rows, columns } = battle.battlefield.map;

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const tilePosition: TilePosition = [row, column];
            if (evaluateRules(battle, { ...input, tilePosition }, rules) === null) {
                result.push(tilePosition);
            }
        }
    }

    return result;
}
