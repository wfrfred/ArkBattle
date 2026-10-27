import { hasTargetable } from "../../unit/capability/targetable/capability.js";
import * as units from "../../unit/query.js";
import type { State as BattleState } from "../state.js";
import type { Request } from "./contract.js";

export function hasCandidate(battle: BattleState, request: Request): boolean {
    return units
        .all(battle)
        .filter(hasTargetable)
        .some((target) => request.filter(battle, request, target));
}
