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
    cooldownOnDeploy = false, recoverOnLeave = true, increaseCostOnLeave = true,
    placement, buildableType, advancedBuildableMask = 1,
    allowedSiteConditions, deploymentRules = [], unitHooks = Hooks.empty(),
    initialize = battle => ({ state: battle, value: {} }),
    ...rest
} = {}) {
    const site = placement ?? buildableType ?? "ALL";
    const allowed = allowedSiteConditions ?? [
        [1, conditions.normal], [2, conditions.deepsea], [4, conditions.tide], [8, conditions.night],
    ].filter(([bit]) => (advancedBuildableMask & bit) !== 0).map(([, condition]) => condition);

    return {
        cost, redeployTicks, slots, stock, stockLimit, activeLimit, refund,
        cooldownOnDeploy, recoverOnLeave, increaseCostOnLeave,
        deploymentRules: [{
            id: "deployment/site",
            allows(battle, { request }) {
                const tile = getTile(battle.battlefield.map, request.tilePosition);
                return tile !== undefined && tile.state.placement !== "NONE" &&
                    (site === "ALL" || tile.state.placement === "ALL" || tile.state.placement === site) &&
                    (tile.state.siteCondition === null || allowed.includes(tile.state.siteCondition));
            },
        }, ...deploymentRules],
        unitHooks, initialize, ...rest,
    };
}
