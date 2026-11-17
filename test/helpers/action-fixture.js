import { attribute, vitality } from "./attribute.js";
import { Hooks } from "../../dist/core/hook.js";
import { tiles as tileEntries } from './tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { selectDamage } from "./targeting.js";
import { create as createBattlefield } from "../../dist/core/battlefield/state.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import { normal as normalSite } from "../../dist/content/terrain/condition.js";
import { initialize } from "./unit.js";
import { actionCapability } from "./actions.js";
import { create as createAttack } from "../../dist/content/actions/attack.js";

export const geometry = [{ type: "CIRCLE", offset: [0, 0], radius: 10 }];
const hit = { type: "CIRCLE", offset: [0, 0], radius: 0.1 };
const tile = createTile({
    terrain: normal.create({}),
    initial: {
        elevation: "LOWLAND", placement: "ALL", passability: "ALL",
        walkCost: 1, allowsBlocking: true, siteCondition: normalSite,
    },
});
const map = createMap(1, 32, tileEntries(Array(32).fill(tile)));

export function actionDefinition(power = 7, configuration = {}) {
    return createAttack(
        {
            id: "primary",
            period: { type: "FIXED", ticks: 10 },
            timing: { type: "FIXED", windupTicks: 0, recoveryTicks: 0 },
            triggerBindingId: "primary",
            targetGroups: [
                {
                    id: "primary",
                    select: selectDamage({
                        geometry,
                        canTargetAir: true,
                        maxTargets: 1,
                    }),
                    operations: [{ type: "DAMAGE", attackType: "NORMAL", applyWay: "MELEE", power, damageType: "TRUE" }],
                },
            ],
            followUps: [],
            ...configuration,
        },
    );
}

export function unit(
    id,
    { hp = 100, side = id === 0 ? "ALLY" : "ENEMY", action = false, ...fields } = {},
) {
    const capability =
        action === false
            ? undefined
            : action === true
              ? actionCapability(actionDefinition())
              : "prepare" in action
                ? actionCapability(action)
                : action;
    const definition = { hooks: Hooks.empty(),
        id: `action-${id}`,
        vitality: vitality(hp),
        targetable: { taunt: attribute(0, -2, 2), restrictions: [] }, presence: {},
        offense: { attack: attribute(10) },
        classification: { type: "DEVICE", side, filterTags: [], groupTags: [] },
        layer: { type: "GROUND" },
        hitbox: { shape: hit },
        ...(capability === undefined ? {} : { action: capability }),
        ...fields,
    };
    for (const [key, value] of Object.entries(definition))
        if (value === undefined) delete definition[key];
    return initialize({ id, position: [id, 0], definition });
}

export function battle(...units) {
    let state = createBattleState(createBattlefield(map));
    for (const unit of units) state = addUnit(state, unit);
    return state;
}
