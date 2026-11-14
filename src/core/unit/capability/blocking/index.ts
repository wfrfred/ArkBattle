export {
    hasBlocker,
    initialize as initializeBlocker,
    resolveCapacity,
    acquired as blockerAcquired,
    released as blockerReleased,
} from "./blocker.js";

export type {
    Definition as BlockerDefinition,
    State as BlockerState,
    Blocker,
    Layer,
    Modifier,
} from "./blocker.js";

export {
    hasBlockable,
    initialize as initializeBlockable,
    resolveVolume,
    stableBlockPosition,
    acquired as blockableAcquired,
    released as blockableReleased,
} from "./blockable.js";

export type {
    Definition as BlockableDefinition,
    State as BlockableState,
    Blockable,
    PositionAdjustment,
} from "./blockable.js";

export { sides, type Restriction, type RestrictionContext } from "./restriction.js";

export type { Relation, Context, Hook } from "./contract.js";

export {
    setRestriction as setBlockerRestriction,
    removeRestriction as removeBlockerRestriction,
    setCapacityContribution,
    removeCapacityContribution,
    setLayer,
    releaseAll,
} from "./blocker-operations.js";

export {
    setRestriction as setBlockableRestriction,
    removeRestriction as removeBlockableRestriction,
    setVolumeContribution,
    removeVolumeContribution,
    release as releaseBlockable,
    advancePosition,
} from "./blockable-operations.js";
