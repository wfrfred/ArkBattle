export const PROFESSIONS = {
    PIONEER: ["PIONEER", "CHARGER", "BEARER", "TACTICIAN", "AGENT", "COUNSELLOR"],
    WARRIOR: [
        "FEARLESS",
        "FIGHTER",
        "CENTURION",
        "LORD",
        "ARTS_FIGHTER",
        "INSTRUCTOR",
        "SWORDMASTER",
        "MUSHA",
        "LIBERATOR",
        "REAPER",
        "CRUSHER",
        "HAMMER",
        "PRIMAL_GUARD",
        "MERCENARY",
    ],
    TANK: [
        "PROTECTOR",
        "GUARDIAN",
        "ARTS_PROTECTOR",
        "UNYIELD",
        "FORTRESS",
        "DUELIST",
        "PRIMAL_PROTECTOR",
        "SHOT_PROTECTOR",
    ],
    SNIPER: [
        "MARKSMAN",
        "SPLASH_SNIPER",
        "BOMBARDER",
        "CLOSE_RANGE",
        "LONG_RANGE",
        "SIEGE_SNIPER",
        "SPREADSHOOTER",
        "HUNTER",
        "LOOP_SHOOTER",
        "SKYBREAKER",
    ],
    CASTER: [
        "CORE_CASTER",
        "SPLASH_CASTER",
        "CHAIN_CASTER",
        "DRONE_CASTER",
        "MYSTIC",
        "PHALANX",
        "BLAST_CASTER",
        "PRIMAL_CASTER",
        "SOUL_CASTER",
    ],
    MEDIC: [
        "PHYSICIAN",
        "RING_HEALER",
        "HEALER",
        "WANDERING_MEDIC",
        "INCANTATION_MEDIC",
        "CHAIN_HEALER",
        "WATCHMAN",
    ],
    SUPPORT: [
        "SLOWER",
        "UNDERMINER",
        "SUMMONER",
        "BARD",
        "BLESSING",
        "CRAFTSMAN",
        "RITUALIST",
        "SUPPORTIVE_RANGER",
    ],
    SPECIAL: [
        "PUSHER",
        "HOOKMASTER",
        "STALKER",
        "EXECUTOR",
        "GEEK",
        "MERCHANT",
        "TRAPMASTER",
        "DOLLKEEPER",
        "ALCHEMIST",
        "SKYWALKER",
    ],
} as const;

export type Profession = keyof typeof PROFESSIONS;

export type SubProfession<P extends Profession = Profession> = (typeof PROFESSIONS)[P][number];

export type ProfessionDefinition<P extends Profession = Profession> = {
    readonly [K in P]: {
        readonly profession: K;
        readonly subProfession: SubProfession<K>;
    };
}[P];
