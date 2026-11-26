import * as conditions from "../../dist/content/terrain/condition.js";
import { get as getTile } from "../../dist/core/battlefield/map/map.js";
import { Hooks } from "../../dist/core/hook.js";
import { dp } from "../../dist/core/battle/deployment/deck/card/index.js";

export function createDefinition({ retreatRestrictions = [], refund = null } = {}) {
    return { retreatRestrictions, refund };
}

export function createCardDefinition({
    cost = 0, redeployTicks = 0, slots = 0,
    consumption = 1, stock = 1, stockLimit = 1, activeLimit = 1,
    policy = "UNIQUE", increase = true,
    placement = "ALL", allowedSiteConditions = [conditions.normal], restrictions = [], hooks = Hooks.empty(),
    initialize = battle => ({ state: battle, value: {} }),
    ...rest
} = {}) {
    return {
        policy,
        dp: { parameters: dp.create({ cost, step: 0.5, maxMultiplier: 2 }), ...(policy === "UNIQUE" ? { increase } : {}) },
        slot: slots,
        supply: {
            consumption, stock, stockLimit, activeLimit, cooldown: redeployTicks,
        },
        restrictions: [{
            id: "deployment/site",
            group: null,
            value: { allows(battle, { request }) {
                const tile = getTile(battle.battlefield.map, request.tilePosition);
                return tile !== undefined && tile.state.placement !== "NONE" &&
                    (placement === "ALL" || tile.state.placement === "ALL" || tile.state.placement === placement) &&
                    (tile.state.siteCondition === null || allowedSiteConditions.includes(tile.state.siteCondition));
            } },
        }, ...restrictions],
        hooks, initialize, ...rest,
    };
}
