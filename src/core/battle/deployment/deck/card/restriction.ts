import type { Contribution } from "../../../../common/contribution.js";
import { get as getTile } from "../../../../battlefield/map/map.js";
import { remaining } from "../../slot/query.js";
import { isReady, resolveActiveLimit } from "./supply/query.js";
import type { Restriction as BaseRestriction } from "../../../../restriction.js";
import type { DeployRequest } from "./request.js";

export interface RestrictionContext {
    readonly request: DeployRequest;
}

export type Restriction = BaseRestriction<RestrictionContext>;

export const defaultRestrictions: readonly Contribution<Restriction>[] = [
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
