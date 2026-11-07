import { Hooks } from "../../dist/core/hook.js";
import { tiles as tileEntries } from './tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { damage as damageTargeting } from "./targeting.js";
import { create as createBattlefield } from "../../dist/core/battlefield/state.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "./tiles.js";
import { initialize } from "./unit.js";
import { actionCapability } from "./actions.js";
import { create as createAttack } from "../../dist/content/actions/attack.js";

export const geometry = [{ type: "CIRCLE", offset: [0, 0], radius: 10 }];
const hit = { type: "CIRCLE", offset: [0, 0], radius: 0.1 };
const tile = createTile({
    heightType: "LOWLAND", meleeBlockable: true,
    buildableType: "ALL",
    passableMask: "ALL",
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
});
const map = createMap(1, 32, tileEntries(Array(32).fill(tile)));

export function actionDefinition(power = 7, extra = {}) {
    const { baseAttackTimeTicks = 10, ...configuration } = extra;
    return createAttack(
        {
            id: "primary",
            intervalTicks: baseAttackTimeTicks,
            speed: 100,
            triggerBindingId: "primary",
            targetGroups: [
                {
                    id: "primary",
                    targeting: damageTargeting({
                        geometry,
                        canTargetAir: true,
                        maxTargets: 1,
                    }),
                    operations: [{ type: "DAMAGE", power, damageType: "TRUE" }],
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
        vitality: { maxHp: hp, defense: 0, resistance: 0 },
        targetable: { restrictions: [] }, spatialPresence: {},
        offense: { attack: 10 },
        allegiance: { side },
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
