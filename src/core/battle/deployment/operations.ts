import type { Ref } from "../../common/ref.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import { retreat } from "../../unit/capability/deployable/operations.js";
import type { Command } from "../contract.js";
import type { State as BattleState } from "../state.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import type { Direction } from "../../geometry/direction.js";
import type { Card } from "./deck/card/card.js";
import { deploy } from "./deck/card/operations.js";
import * as deck from "./deck/operations.js";
import * as dp from "./dp/operations.js";
import * as slot from "./slot/operations.js";

export type DeploymentCommand =
    | {
          readonly type: "DEPLOY_UNIT";
          readonly ref: Ref<Card>;
          readonly tilePosition: TilePosition;
          readonly direction: Direction | null;
      }
    | { readonly type: "RETREAT_UNIT"; readonly ref: Ref<Unit & Deployable> };

export function resolveDeploymentCommands(
    battle: BattleState,
    commands: readonly Command[],
): BattleState {
    for (const command of commands) {
        if (command.type === "DEPLOY_UNIT") {
            battle = deploy(battle, {
                card: command.ref,
                tilePosition: command.tilePosition,
                direction: command.direction,
                quote: null,
                restrictions: [],
            }).state;
        } else if (command.type === "RETREAT_UNIT") {
            battle = retreat(battle, command.ref);
        }
    }

    return battle;
}

export function advance(state: BattleState): BattleState {
    state = slot.advance(state);
    state = deck.advance(state);

    return dp.advance(state);
}
