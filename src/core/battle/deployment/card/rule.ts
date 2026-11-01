import type { Ref } from "../../../common/ref.js";
import type { Rule as BaseRule } from "../../../rule.js";
import type { DeployRequest } from "../program.js";
import type { Card } from "./card.js";

export type RuleContext<T extends Card<any> = Card> =
    | {
          readonly purpose: "DISPLAY" | "SELECT";
          readonly ref: Ref<T>;
      }
    | {
          readonly purpose: "DEPLOY";
          readonly request: DeployRequest<T>;
      };

export type Purpose = RuleContext["purpose"];

export type Rule = BaseRule<RuleContext>;
