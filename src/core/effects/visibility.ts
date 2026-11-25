import { update as updateUnit } from "../unit/operations.js";

import type { Definition } from "../effect/index.js";
import type { Unit } from "../unit/index.js";
import { areHostile, hasClassification } from "../unit/capability/classification/index.js";
import * as targetable from "../unit/capability/targetable/capability.js";

function restriction(
    id: string,
    value: targetable.Restriction,
): Definition<object, Unit & targetable.Targetable> {
    return {
        id,
        initialize: () => ({}),
        onEnable(state, self) {
            return updateUnit(
                state,
                self.ref.host,
                targetable.setRestriction({
                    id: `@effect/${self.id}/targeting`,
                    value,
                }),
            );
        },
        onDisable(state, self) {
            return updateUnit(
                state,
                self.ref.host,
                targetable.removeRestriction(`@effect/${self.id}/targeting`),
            );
        },
    };
}

const allowsSameSide: targetable.Restriction["allows"] = (_battle, { source, target: owner }) =>
    !hasClassification(source) ||
    !hasClassification(owner) ||
    source.definition.classification.side === owner.definition.classification.side;

export const invisibleRestriction: targetable.Restriction = {
    allows: allowsSameSide,
};

export const camouflageRestriction: targetable.Restriction = {
    allows(_battle, { source, target: owner }) {
        return (
            !hasClassification(source) || !hasClassification(owner) || !areHostile(source, owner)
        );
    },
};

export const untargetableRestriction: targetable.Restriction = {
    allows: allowsSameSide,
};

export const allyUntargetableRestriction: targetable.Restriction = {
    allows(_battle, { source, target: owner }) {
        return (
            !hasClassification(source) ||
            !hasClassification(owner) ||
            source.definition.classification.side !== owner.definition.classification.side
        );
    },
};

export const invisible = restriction("visibility/invisible", invisibleRestriction);

export const camouflage = restriction("visibility/camouflage", camouflageRestriction);

export const untargetable = restriction("visibility/untargetable", untargetableRestriction);

export const allyUntargetable = restriction(
    "visibility/ally-untargetable",
    allyUntargetableRestriction,
);
