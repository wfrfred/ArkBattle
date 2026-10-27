import { createDefinition as create } from "../../dist/core/unit/capability/deployable/index.js";
import * as conditions from "../../dist/content/terrain/condition.js";
export { initialize, hasDeployable } from "../../dist/core/unit/capability/deployable/index.js";

export function createDefinition({ buildableType, advancedBuildableMask = 1, ...definition }) {
    return create({
        ...definition,
        placement: definition.placement ?? buildableType,
        allowedSiteConditions: definition.allowedSiteConditions ?? [
            [1, conditions.normal], [2, conditions.deepsea], [4, conditions.tide], [8, conditions.night],
        ].filter(([bit]) => (advancedBuildableMask & bit) !== 0).map(([, condition]) => condition),
    });
}
