import { attribute } from "./attribute.js";

export function actionCapability(...definitions) {
    return {
        speed: attribute(100, 20),
        interval: attribute(10),
        definitions,
    };
}
