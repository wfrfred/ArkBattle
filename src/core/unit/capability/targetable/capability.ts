import * as contribution from "../../contribution/contribution.js";
import type { Contribution } from "../../contribution/contribution.js";
import type { Unit } from "../../unit.js";
import type { Request } from "../../../battle/targeting/contract.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { createRegistrationOperations } from "../../registration.js";

export interface Definition {
    readonly restrictions: readonly Contribution<Restriction>[];
}

export interface Context {
    readonly request: Request;
    readonly owner: Unit & Targetable;
}

export interface Restriction {
    readonly kind: symbol;
    readonly allows: (battle: BattleState, context: Context) => boolean;
}

interface Contributions {
    readonly restrictions: readonly Contribution<Restriction>[];
}

export interface State extends Contributions {}

export interface Targetable {
    readonly definition: { readonly targetable: Definition };
    readonly targetable: State;
}

export function hasTargetable<U extends Unit>(unit: U): unit is U & Targetable {
    return "targetable" in unit && "targetable" in unit.definition;
}

export function initialize<U extends Unit & Pick<Targetable, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Targetable> {
    const definition = unit.definition.targetable;
    const ids = new Set<string>();

    for (const entry of definition.restrictions) {
        if (ids.has(entry.id)) {
            throw new TypeError(`duplicate targetable restriction identity: ${entry.id}`);
        }

        ids.add(entry.id);
    }

    return {
        state: battle,
        value: { ...unit, targetable: { restrictions: [...definition.restrictions] } },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Targetable,
    "targetable",
    keyof Contributions
>("targetable", "restrictions");

export function allowsRestrictions(
    battle: BattleState,
    request: Request,
    owner: Unit & Targetable,
    ignore?: (kind: symbol) => boolean,
): boolean {
    return contribution
        .resolve(owner.targetable.restrictions)
        .every(
            (restriction) =>
                (ignore?.(restriction.kind) ?? false) ||
                restriction.allows(battle, { request, owner }),
        );
}
