import type { Ref } from "../../common/ref.js";
import { Tile } from "../../geometry/coordinate.js";
import type { Departure, Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import type { LeaveHook } from "../../unit/hook.js";
import { instantiateUnitPlacement } from "../creation/placement.js";
import type { State as BattleState } from "../state.js";
import * as cards from "./card/operations.js";
import { get, allows } from "./card/query.js";
import { resolveBaseCost, resolveCost, advance } from "./card/state.js";
import type { Card } from "./card/card.js";
import type { DeployRequest, Program } from "./program.js";
import { activeCount } from "./query.js";
import { replaceCard } from "./resources.js";

interface Definition {
    readonly id: string;
    readonly consume: (battle: BattleState, reference: Ref<Card>) => BattleState;
    readonly onLeave?: (
        battle: BattleState,
        reference: Ref<Card>,
        departure: Departure,
    ) => BattleState;
}

export function create(definition: Definition): Program<DeployRequest> {
    const onLeave = definition.onLeave;
    const leave =
        onLeave === undefined
            ? undefined
            : ({
                  id: "@deployment/return",
                  stage: "leave",
                  invoke: (battle, departure) => ({
                      state: onLeave(
                          battle,
                          (departure.unit as Unit & Deployable).deployable.card!,
                          departure,
                      ),
                      value: undefined,
                  }),
              } satisfies LeaveHook);

    return {
        id: definition.id,
        prepare: (battle, request) => {
            const stored = get(battle, request.card);
            if (stored === undefined) {
                return { type: "REJECTED", reason: "UNKNOWN_CARD" };
            }

            const self = advance(stored, battle.tick);
            const current = replaceCard(battle, self);
            if (self.stock === 0) {
                return { type: "REJECTED", reason: "NO_STOCK" };
            }
            if (!allows(current, { purpose: "DEPLOY", request })) {
                return { type: "REJECTED", reason: "RULE" };
            }

            if (self.cooldown !== null) {
                return { type: "REJECTED", reason: "COOLDOWN" };
            }
            if (
                self.activeLimit !== null &&
                activeCount(current, request.card) >= self.activeLimit
            ) {
                return { type: "REJECTED", reason: "ACTIVE_LIMIT" };
            }

            const unitDefinition = self.definition;
            const cost = resolveCost(self, battle.deployment.definition.costCeiling ?? 99);
            const hooks = leave === undefined ? self.hooks : [...self.hooks, leave];

            return {
                type: "PREPARED",
                card: request.card,
                placement: {
                    profile: unitDefinition.deployable,
                    tile: request.tilePosition,
                    slot: unitDefinition.occupancy.slot,
                },
                cost,
                slots: unitDefinition.deployable.slots,
                refund: {
                    rate: unitDefinition.deployable.refund.rate,
                    limit:
                        unitDefinition.deployable.refund.limit === "DEPLOYMENT_COST"
                            ? cost
                            : resolveBaseCost(self),
                },
                retreatAllowed: true,
                payment: { amount: cost },
                consume: (latest) =>
                    definition.consume(
                        replaceCard(latest, advance(get(latest, request.card)!, latest.tick)),
                        request.card,
                    ),
                initialize: (current) =>
                    instantiateUnitPlacement(current, {
                        definition: unitDefinition,
                        position: Tile.center(request.tilePosition),
                        initial: {
                            occupancy: {
                                tile: request.tilePosition,
                                ...(request.direction === undefined
                                    ? {}
                                    : { direction: request.direction }),
                            },
                        },
                        hooks,
                    }),
            };
        },
    };
}

export const operator = create({
    id: "@deployment/operator",
    consume: cards.consume,
    onLeave: (battle, reference, departure) => {
        if (departure.reason === "RETREAT" || departure.reason === "DEATH") {
            battle = cards.incrementCostStage(battle, reference);
        }

        return cards.enqueueRecovery(battle, reference);
    },
});

export const consumable = create({
    id: "@deployment/consumable",
    consume: (battle, reference) =>
        cards.startCooldown(cards.consume(battle, reference), reference),
});

export const queued = create({
    id: "@deployment/queued",
    consume: cards.consume,
    onLeave: (battle, reference) => cards.enqueueRecovery(battle, reference),
});
