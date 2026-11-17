import type { Unit } from "../../unit.js";
import type { Classification, Rank, Type } from "./capability.js";
import type { Profession, SubProfession } from "./professions.js";

export function isType<U extends Unit & Classification>(
    self: U,
    type: "OPERATOR",
): self is U & Classification<"OPERATOR">;
export function isType<U extends Unit & Classification>(
    self: U,
    type: "SUMMON",
): self is U & Classification<"SUMMON">;
export function isType<U extends Unit & Classification>(
    self: U,
    type: "DEVICE",
): self is U & Classification<"DEVICE">;
export function isType<U extends Unit & Classification>(
    self: U,
    type: "ENEMY",
): self is U & Classification<"ENEMY">;
export function isType(self: Unit & Classification, type: Type): boolean;
export function isType(self: Unit & Classification, type: Type): boolean {
    return self.definition.classification.type === type;
}

export function areHostile(left: Unit & Classification, right: Unit & Classification): boolean {
    return (
        (left.definition.classification.side === "ENEMY") !==
        (right.definition.classification.side === "ENEMY")
    );
}

export function hasFilterTag(self: Unit & Classification, tag: string): boolean {
    const definition = self.definition.classification;

    return (
        (definition.type === "ENEMY" || definition.type === "DEVICE") &&
        definition.filterTags.includes(tag)
    );
}

export function hasGroupTag(self: Unit & Classification, tag: string): boolean {
    const definition = self.definition.classification;

    return definition.type !== "ENEMY" && definition.groupTags.includes(tag);
}

export function matchesProfession(
    self: Unit & Classification,
    professions: readonly Profession[],
    includeExtra: boolean,
): boolean {
    const definition = self.definition.classification;

    return (
        definition.type === "OPERATOR" &&
        (professions.includes(definition.profession) ||
            (includeExtra &&
                definition.extraProfessions.some((profession) => professions.includes(profession))))
    );
}

export function matchesRank(self: Unit & Classification, ranks: readonly Rank[]): boolean {
    const definition = self.definition.classification;

    return definition.type === "ENEMY" && ranks.includes(definition.rank);
}

export function matchesSubProfession(
    self: Unit & Classification,
    subProfessions: readonly SubProfession[],
): boolean {
    const definition = self.definition.classification;

    return (
        (definition.type === "OPERATOR" || definition.type === "SUMMON") &&
        definition.subProfession !== null &&
        subProfessions.includes(definition.subProfession)
    );
}
