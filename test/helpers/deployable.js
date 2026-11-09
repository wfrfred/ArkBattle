import * as conditions from "../../dist/content/terrain/condition.js";
import { get as getTile } from "../../dist/core/battlefield/map/map.js";
import { Hooks } from "../../dist/core/hook.js";

export function createDefinition({ retreatRules = [] } = {}) {
    return { retreatRules };
}

export function createCardDefinition({
    cost = 0, redeployTicks = 0, slots = 0,
    stock = 1, stockLimit = 1, activeLimit = 1,
    refund = { rate: 0.5, limit: "BASE_COST" },
    cooldownOnDeploy = false, recoverOnRetreatOrDeath = true, increaseCostOnRetreatOrDeath = true,
    placement = "ALL", allowedSiteConditions = [conditions.normal], deploymentRules = [], unitHooks = Hooks.empty(),
    initialize = battle => ({ state: battle, value: {} }),
    ...rest
} = {}) {
    return {
        cost, redeployTicks, slots, stock, stockLimit, activeLimit, refund,
        cooldownOnDeploy, recoverOnRetreatOrDeath, increaseCostOnRetreatOrDeath,
        deploymentRules: [{
            id: "deployment/site",
            allows(battle, { request }) {
                const tile = getTile(battle.battlefield.map, request.tilePosition);
                return tile !== undefined && tile.state.placement !== "NONE" &&
                    (placement === "ALL" || tile.state.placement === "ALL" || tile.state.placement === placement) &&
                    (tile.state.siteCondition === null || allowedSiteConditions.includes(tile.state.siteCondition));
            },
        }, ...deploymentRules],
        unitHooks, initialize, ...rest,
    };
}
