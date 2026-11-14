import type { Ref } from "../../../common/ref.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";
import type { DeployRequest } from "../request.js";
import type { Card } from "./card.js";

export type RestrictionContext<T extends Card<any> = Card> =
    | {
          readonly purpose: "DISPLAY" | "SELECT";
          readonly ref: Ref<T>;
      }
    | {
          readonly purpose: "DEPLOY";
          readonly request: DeployRequest<T>;
      };

export type Purpose = RestrictionContext["purpose"];

export type Restriction = BaseRestriction<RestrictionContext>;
