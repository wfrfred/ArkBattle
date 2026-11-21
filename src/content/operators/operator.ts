import type { Unit } from "../../core/unit/index.js";
import type { Blocker } from "../../core/unit/capability/blocking/index.js";
import type { Classification } from "../../core/unit/capability/classification/index.js";
import type { Deployable } from "../../core/unit/capability/deployable/index.js";
import type { Elemental } from "../../core/unit/capability/elemental/index.js";
import type { Facing } from "../../core/unit/capability/facing/index.js";
import type { Hitbox } from "../../core/unit/capability/hitbox/capability.js";
import type { Layer } from "../../core/unit/capability/layer/index.js";
import type { Occupancy } from "../../core/unit/capability/occupancy/index.js";
import type { Offense } from "../../core/unit/capability/offense/index.js";
import type { Targetable } from "../../core/unit/capability/targetable/capability.js";
import type { Vitality } from "../../core/unit/capability/vitality/index.js";

export type Operator = Unit &
    Classification<"OPERATOR"> &
    Vitality &
    Elemental &
    Offense &
    Blocker &
    Targetable &
    Layer &
    Hitbox &
    Facing &
    Occupancy &
    Deployable;
