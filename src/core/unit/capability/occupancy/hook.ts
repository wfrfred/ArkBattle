import type { TilePosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import type { Hook } from "../../../hook.js";
import type { Occupancy } from "./capability.js";

export interface Context {
    readonly support: Unit & Occupancy;
    readonly occupant: Unit & Occupancy;
    readonly tile: TilePosition;
}

export interface OccupantAddedHook extends Hook<Context, void> {
    readonly stage: "occupantAdded";
}

export interface OccupantRemovedHook extends Hook<Context, void> {
    readonly stage: "occupantRemoved";
}

export type SupportHook = OccupantAddedHook | OccupantRemovedHook;
