export {
    RANKS,
    hasClassification,
    initialize,
    type Rank,
    type Type,
    type Definition,
    type State,
    type Classification,
} from "./capability.js";

export {
    PROFESSIONS,
    type Profession,
    type SubProfession,
    type ProfessionDefinition,
} from "./professions.js";

export {
    isType,
    areHostile,
    hasFilterTag,
    hasGroupTag,
    matchesProfession,
    matchesRank,
    matchesSubProfession,
} from "./query.js";
