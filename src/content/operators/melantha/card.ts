import { create } from "../card.js";
import type { Parameters } from "./parameters.js";

export function createCard({ attributes: { cost, respawnTime } }: Parameters) {
    return create({ cost, respawnTime, placement: "MELEE" });
}
