import { Store } from "../../common/collection/store.js";
import type { Query } from "../../common/query.js";
import { ref, type Ref } from "../../common/ref.js";
import type { Definition, OrdinaryDefinition, StackDefinition } from "./definition.js";
import type { Effect, OrdinaryEffect, StackEffect, Id } from "./effect.js";

export class Effects {
    static readonly #empty = new Effects(Store.empty<Ref<Effect<any, any>>, Effect<any, any>>(), 0);

    readonly #entries: Store<Ref<Effect<any, any>>, Effect<any, any>>;
    readonly nextId: Id;

    private constructor(entries: Store<Ref<Effect<any, any>>, Effect<any, any>>, nextId: Id) {
        this.#entries = entries;
        this.nextId = nextId;
    }

    static empty(): Effects {
        return Effects.#empty;
    }

    get size(): number {
        return this.#entries.size;
    }

    get<E extends Effect<any, any>>(reference: Ref<E>): E | undefined;
    get<S extends object, H extends object>(
        reference: Ref<Effect<any, any>>,
        definition: StackDefinition<S, H, "END">,
    ): StackEffect<S, H, "END"> | undefined;
    get<S extends object, H extends object>(
        reference: Ref<Effect<any, any>>,
        definition: StackDefinition<S, H, "DECAY">,
    ): StackEffect<S, H, "DECAY"> | undefined;
    get<S extends object, H extends object>(
        reference: Ref<Effect<any, any>>,
        definition: StackDefinition<S, H>,
    ): StackEffect<S, H> | undefined;
    get<S extends object, H extends object>(
        reference: Ref<Effect<any, any>>,
        definition: OrdinaryDefinition<S, H>,
    ): OrdinaryEffect<S, H> | undefined;
    get<S extends object, H extends object>(
        reference: Ref<Effect<any, any>>,
        definition: Definition<S, H>,
    ): Effect<S, H> | undefined;
    get<E extends Effect<any, any>>(
        reference: Ref<E>,
        definition?: Definition<any, any>,
    ): Effect<any, any> | undefined {
        const effect = this.#entries.get(reference);
        if (definition === undefined) {
            return effect;
        }

        return effect?.definition === definition ? effect : undefined;
    }

    values(): Query<Effect> {
        return this.#entries.values() as Query<Effect>;
    }

    keys(): Query<Ref<Effect>> {
        return this.#entries.keys();
    }

    add<S extends object, H extends object>(effect: Effect<S, H>): Effects {
        if (effect.id !== this.nextId) {
            throw new RangeError("invalid effect registration id");
        }

        const stored = effect as Effect<any, any>;

        return new Effects(this.#entries.add(ref(stored), stored), this.nextId + 1);
    }

    replace<S extends object, H extends object>(effect: Effect<S, H>): Effects {
        const stored = effect as Effect<any, any>;
        const reference = ref(stored);
        const previous = this.#entries.get(reference);
        if (previous === undefined || previous === stored) {
            return this;
        }

        return new Effects(this.#entries.replace(reference, stored), this.nextId);
    }

    remove(reference: Ref<Effect>): Effects {
        return this.#entries.get(reference) === undefined
            ? this
            : new Effects(this.#entries.remove(reference), this.nextId);
    }
}
