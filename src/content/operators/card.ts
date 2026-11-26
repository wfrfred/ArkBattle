import {
    dp,
    type Definition as CardDefinition,
} from "../../core/battle/deployment/deck/card/index.js";
import { get as getTile } from "../../core/battlefield/map/map.js";
import { Hooks } from "../../core/hook.js";
import { secondsToTicks } from "../../core/tick.js";
import { normal as normalSite } from "../terrain/condition.js";

export interface Parameters {
    readonly cost: number;
    readonly respawnTime: number;
}

export function create({ cost, respawnTime }: Parameters): CardDefinition<object, "UNIQUE"> {
    return {
        dp: {
            parameters: dp.create({ cost, step: 0.5, maxMultiplier: 2 }),
            increase: true,
        },
        slot: 1,
        policy: "UNIQUE",
        supply: {
            stock: 1,
            consumption: 1,
            stockLimit: 1,
            activeLimit: 1,
            cooldown: secondsToTicks(respawnTime),
        },
        restrictions: [
            {
                id: "deployment/site",
                group: null,
                value: {
                    allows(battle, { request }) {
                        const tile = getTile(battle.battlefield.map, request.tilePosition);

                        return (
                            tile !== undefined &&
                            (tile.state.placement === "MELEE" || tile.state.placement === "ALL") &&
                            (tile.state.siteCondition === null ||
                                tile.state.siteCondition === normalSite)
                        );
                    },
                },
            },
        ],
        hooks: Hooks.empty(),
        initialize: (battle) => ({ state: battle, value: {} }),
    };
}
