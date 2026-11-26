export {
    hasBlockable,
    initialize,
    resolveVolume,
    acquired,
    released,
    setRestriction,
    removeRestriction,
    setVolumeContribution,
    removeVolumeContribution,
    type Blockable,
    type Definition,
    type State,
    type BlockOffset,
} from "./blockable.js";

export { release, advanceOffset } from "./operations.js";
