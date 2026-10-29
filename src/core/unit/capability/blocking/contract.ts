import type { Ref } from "../../../common/ref.js";
import type { Hook as TacticalHook } from "../../../hook.js";
import type { Unit } from "../../unit.js";
import type { Blocker } from "./blocker.js";
import type { Blockable } from "./blockable.js";

export interface Relation {
    readonly blocker: Ref<Unit & Blocker>;
    readonly blocked: Ref<Unit & Blockable>;
}

export type Key = "acquired" | "released";

export interface Context<U extends Unit> {
    readonly host: Ref<U>;
    readonly relation: Relation;
}

export type Hook<U extends Unit> = TacticalHook<Context<U>, void>;
