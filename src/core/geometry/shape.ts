import { assert, assertFiniteNumber, assertNonnegativeNumber } from "../common/assert.js";
import type { WorldPosition } from "./coordinate.js";

export type Shape =
    | {
          readonly type: "CIRCLE";
          readonly offset: WorldPosition;
          readonly radius: number;
      }
    | {
          readonly type: "BOX";
          readonly offset: WorldPosition;
          readonly halfExtents: WorldPosition;
      }
    | {
          readonly type: "CAPSULE";
          readonly offset: WorldPosition;
          readonly radius: number;
          readonly axis: "X" | "Y";
          readonly halfLength: number;
      };

export function validateShape(shape: Shape): void {
    assertFiniteNumber(shape.offset[0], "shape offset x");
    assertFiniteNumber(shape.offset[1], "shape offset y");

    switch (shape.type) {
        case "CIRCLE":
            assertNonnegativeNumber(shape.radius, "circle radius");
            break;

        case "BOX":
            assertNonnegativeNumber(shape.halfExtents[0], "box half width");
            assertNonnegativeNumber(shape.halfExtents[1], "box half height");
            break;

        case "CAPSULE":
            assert(["X", "Y"].includes(shape.axis), "invalid capsule axis", TypeError);
            assertNonnegativeNumber(shape.radius, "capsule radius");
            assertNonnegativeNumber(shape.halfLength, "capsule half segment length");
            break;

        default:
            throw new TypeError("invalid shape");
    }
}
