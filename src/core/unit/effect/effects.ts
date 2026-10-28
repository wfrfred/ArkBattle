import { Store } from "../../common/collection/store.js";
import type { Query } from "../../common/query.js";
import type { Ref } from "../../common/ref.js";
import type { Definition } from "./definition.js";
import type { Effect, Id, Snapshot } from "./effect.js";

export class Effects {
    static readonly #empty = new Effects(Store.empty<Id, Effect<any, any>>(), 0);

    readonly #entries: Store<Id, Effect<any, any>>;
    readonly nextId: Id;

    private constructor(entries: Store<Id, Effect<any, any>>, nextId: Id) {
        this.#entries = entries;
        this.nextId = nextId;
    }

    static empty(): Effects {
        return Effects.#empty;
    }

    get size(): number {
        return this.#entries.size;
    }

    get(id: Id): Effect | undefined;
    get<E extends Effect<any, any>>(reference: Ref<E>): E | undefined;
    get<S extends object, H extends object>(
        id: Id,
        definition: Definition<S, H>,
    ): Effect<S, H> | undefined;
    get<E extends Effect<any, any>, S extends object, H extends object>(
        identity: Id | Ref<E>,
        definition?: Definition<S, H>,
    ): Effect<any, any> | undefined {
        const effect = this.#entries.get(typeof identity === "number" ? identity : identity.id);
        if (typeof identity !== "number" && effect?.host.id !== identity.host.id) {
            return undefined;
        }
        if (definition === undefined) {
            return effect;
        }

        return effect?.definition === definition ? effect : undefined;
    }

    getEffect(id: Id): Effect<any, any> | undefined {
        return this.#entries.get(id);
    }

    values(): Query<Effect> {
        return this.#entries.values() as Query<Effect>;
    }

    keys(): Query<Id> {
        return this.#entries.keys();
    }

    add<S extends object, H extends object>(effect: Effect<S, H>): Effects {
        if (effect.id !== this.nextId) {
            throw new RangeError("invalid effect identity");
        }

        return new Effects(this.#entries.add(effect.id, effect), this.nextId + 1);
    }

    replace<T extends Effect<any, any>>(reference: Ref<T>, effect: NoInfer<T>): Effects {
        const previous = this.#entries.get(reference.id);
        if (previous === undefined || previous === effect) {
            return this;
        }

        return new Effects(this.#entries.replace(reference.id, effect), this.nextId);
    }

    remove(id: Id): Effects {
        return this.#entries.get(id) === undefined
            ? this
            : new Effects(this.#entries.remove(id), this.nextId);
    }

    toJSON(): { readonly instances: readonly Snapshot[]; readonly nextId: Id } {
        return {
            instances: this.#entries.values().toArray(),
            nextId: this.nextId,
        };
    }
}
