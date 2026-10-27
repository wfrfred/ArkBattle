import { create, createActions } from "../../dist/core/unit/action/initialize.js";

export function actionCapability(...definitions) {
    const initializers = definitions.map(create);

    return {
        initialize: battle => createActions(battle, ...initializers),
    };
}
