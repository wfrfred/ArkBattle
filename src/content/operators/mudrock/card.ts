import { create } from "../card.js";
import type { Parameters } from "./parameters.js";

export function createCard({ attributes: { cost, redeployTime } }: Parameters) {
    return create({ cost, redeployTime, placement: "MELEE" });
}
