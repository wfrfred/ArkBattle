import { create, createActions } from "../../dist/core/unit/action/index.js";
import { attribute } from "./attribute.js";

export function actionCapability(...definitions) {
    const initializers = definitions.map(create);

    return {
        speed: attribute(100, 20),
        interval: attribute(10),
        initialize: (battle, self) => createActions(battle, self, ...initializers),
    };
}
