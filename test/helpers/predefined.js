export function predefinedUnits(creations, definitions = []) {
    const firstId = definitions.reduce((next, definition) => Math.max(next, definition.id + 1), 0);
    return [
        ...creations.map((creation, index) => ({
            id: firstId + index,
            alias: null,
            initiallyPresent: true,
            creation: { type: "UNIT", ...creation },
        })),
        ...definitions,
    ];
}
