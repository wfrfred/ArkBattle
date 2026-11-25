import { Store } from "../common/collection/store.js";
import type { Query } from "../common/query.js";
import { ref, type Ref } from "../common/ref.js";
import type { Lifetime } from "../lifetime/index.js";
import type { Definition } from "./definition.js";
import type { Effect, Id } from "./effect.js";
import type { Policy } from "./expiration.js";

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

    get<T extends Effect<any, any>>(reference: Ref<T>): T | undefined;
    get<S extends object, H extends Lifetime | null, P extends Policy = undefined>(
        reference: Ref<Effect<any, any>>,
        definition: Definition<S, H, P>,
    ): Effect<S, H, P> | undefined;
    get(
        reference: Ref<Effect<any, any>>,
        definition?: Pick<Definition<object, Lifetime | null, Policy>, "id">,
    ): Lifetime | undefined {
        const effect = this.#entries.get(reference);
        if (definition === undefined) {
            return effect;
        }

        return effect?.definition === definition ? effect : undefined;
    }

    values(): Query<Effect> {
        return this.#entries.values();
    }

    add<S extends object, H extends Lifetime | null, P extends Policy>(
        effect: Effect<S, H, P>,
    ): Effects {
        if (effect.id !== this.nextId) {
            throw new RangeError("invalid effect registration id");
        }

        const stored = effect as Effect<any, any>;

        return new Effects(this.#entries.add(ref(stored), stored), this.nextId + 1);
    }

    replace<S extends object, H extends Lifetime | null, P extends Policy>(
        effect: Effect<S, H, P>,
    ): Effects {
        const stored = effect as Effect<any, any>;
        const reference = ref(stored);
        const previous = this.#entries.get(reference);
        if (previous === undefined || previous === stored) {
            return this;
        }

        return new Effects(this.#entries.replace(reference, stored), this.nextId);
    }

    remove(reference: Ref<Effect<any, any>>): Effects {
        return this.#entries.get(reference) === undefined
            ? this
            : new Effects(this.#entries.remove(reference), this.nextId);
    }
}
