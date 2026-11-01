import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("Rule APIs preserve node contexts and typed Card references", async () => {
    const { default: ts } = await import("typescript");
    const cache = fileURLToPath(new URL("../../.cache/", import.meta.url));
    mkdirSync(cache, { recursive: true });
    const directory = mkdtempSync(join(cache, "rule-api-types-"));
    const source = name => JSON.stringify(fileURLToPath(new URL(`../../src/core/${name}.js`, import.meta.url)));
    const path = join(directory, "rules.mts");

    try {
        writeFileSync(path, `
import type { Rule } from ${source("rule")};
import type { State as BattleState } from ${source("battle/state")};
import type { Ref } from ${source("common/ref")};
import type { Unit } from ${source("unit/unit")};
import type { Change } from ${source("unit/change")};
import * as skill from ${source("unit/capability/skill/index")};
import * as elemental from ${source("unit/capability/elemental/index")};
import * as blocker from ${source("unit/capability/blocking/index")};
import * as cards from ${source("battle/deployment/card/index")};
import type { DeployRequest } from ${source("battle/deployment/program")};

declare const battle: BattleState;
declare const skillRef: Ref<Unit & skill.Skill>;
declare const elementalRef: Ref<Unit & elemental.Elemental>;

const recovery: skill.Rule<"recovery"> = {
    id: "recovery",
    allows(_battle, context) {
        const source: string = context.source;
        const self: Unit & skill.Skill = context.self;
        // @ts-expect-error recovery rules do not receive activation operations.
        context.operation;
        return source.length > 0 && self.skill.activation === null;
    },
};
const changed: Change = skill.setRule(skillRef, "recovery", recovery);
skill.removeRule(skillRef, "recovery", recovery.id);
declare const operation: skill.Rule<"operation">;
// @ts-expect-error the node fixes the rule's context rather than inferring a union.
skill.setRule(skillRef, "recovery", operation);
// @ts-expect-error registration must specify a node in a multi-node domain.
skill.setRule(skillRef, recovery);
// @ts-expect-error only declared nodes can be selected.
skill.removeRule(skillRef, "unknown", recovery.id);

elemental.setRule(elementalRef, "damage", {
    id: "only-burn",
    allows(_battle, { self, request }) {
        return self.elemental.burst === null && request.type === "BURN";
    },
});
const healing: elemental.Rule<"heal"> = {
    id: "heal",
    allows(_battle, { request }) {
        // @ts-expect-error elemental healing does not receive a damage type.
        request.type;
        return request.power > 0;
    },
};
// @ts-expect-error damage and healing callbacks have different request types.
elemental.setRule(elementalRef, "heal", {} as elemental.Rule<"damage">);

const pair: blocker.Rule = {
    id: "pair",
    allows(_battle, { blocker, blockable }) {
        return blocker.blocker.layer === "GROUND" && blockable.blockable.blocker === null;
    },
};
// @ts-expect-error rules return a boolean, not a state transition.
const sideEffect: Rule<object> = { id: "invalid", allows: () => battle };
// @ts-expect-error the old optional callback protocol is removed.
const legacy: skill.Rule<"activation"> = { id: "legacy", allowsActivation: () => false };

declare const typedCard: Ref<cards.Card<{ readonly charges: number }>>;
cards.allows(battle, { purpose: "SELECT", ref: typedCard });
const request: DeployRequest<cards.Card<{ readonly charges: number }>> = {
    card: typedCard, tilePosition: [0, 0], direction: "RIGHT",
};
cards.allows(battle, { purpose: "DEPLOY", request });
// @ts-expect-error deployment qualification requires its actual request.
cards.allows(battle, { purpose: "DEPLOY", ref: typedCard });
const observer: cards.Rule = {
    id: "observer",
    allows(current, context) {
        const ref = context.purpose === "DEPLOY" ? context.request.card : context.ref;
        const card = cards.get(current, ref);
        if (card !== undefined) {
            // @ts-expect-error ordinary rules do not know a Card's private state shape.
            card.state.charges;
        }
        return true;
    },
};
`);
        const program = ts.createProgram([path], {
            strict: true,
            noEmit: true,
            skipLibCheck: true,
            exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true,
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
            types: [],
        });
        assert.deepEqual(ts.getPreEmitDiagnostics(program).map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")), []);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
