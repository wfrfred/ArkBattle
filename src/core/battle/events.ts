import type { Event, UnitRemoval } from "./contract.js";

export function finishBattleEvents(
    phaseEvents: readonly Event[],
    removedUnits: readonly UnitRemoval[],
    tick: number,
) {
    const events: Event[] = [
        ...phaseEvents,
        ...removedUnits.map((removed): Event => ({
            type: "UNIT_REMOVED",
            ...removed,
            tick,
        })),
    ];

    return {
        events,
        completedRouteCount: events.filter((event) => event.type === "ROUTE_COMPLETED").length,
    };
}
