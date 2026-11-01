import type { Unit } from "../../unit.js";
import * as hook from "../../../hook.js";
import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";
import type { Deployable } from "./capability.js";
import type { Payment } from "../../../battle/deployment/program.js";

export interface Deployed {
    readonly unit: Unit & Deployable;
    readonly program: string;
    readonly origin: "MANUAL" | "CONTENT";
    readonly payment: Payment | null;
}

export type DeployedHook = hook.Hook<Deployed, void>;

export function setHook(reference: Ref<Unit & Deployable>, entry: DeployedHook): Change {
    return createChange(reference, (self) => {
        const deployedHooks = hook.set(self.deployable.deployedHooks, entry);

        return deployedHooks === self.deployable.deployedHooks
            ? self
            : { ...self, deployable: { ...self.deployable, deployedHooks } };
    });
}

export function removeHook(reference: Ref<Unit & Deployable>, id: string): Change {
    return createChange(reference, (self) => {
        const deployedHooks = hook.remove(self.deployable.deployedHooks, id);

        return deployedHooks === self.deployable.deployedHooks
            ? self
            : { ...self, deployable: { ...self.deployable, deployedHooks } };
    });
}
