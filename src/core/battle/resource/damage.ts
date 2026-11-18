export type AttackType = "NONE" | "NORMAL" | "SPLASH" | "BUFF" | "ADDITION";

export type ApplyWay = "NONE" | "MELEE" | "RANGED" | "ALL";

export function mergeApplyWays(ways: Iterable<ApplyWay>): ApplyWay {
    let result: ApplyWay = "NONE";

    for (const way of ways) {
        if (way === "NONE" || way === result) {
            continue;
        }
        if (result !== "NONE") {
            return "ALL";
        }

        result = way;
    }

    return result;
}
