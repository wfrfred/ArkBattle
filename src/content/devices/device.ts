import type { Unit } from "../../core/unit/index.js";
import type { Classification } from "../../core/unit/capability/classification/index.js";

export type Device = Unit & Classification<"DEVICE">;
