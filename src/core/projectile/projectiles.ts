import { Store } from "../common/collection/store.js";
import type { Query } from "../common/query.js";
import type { Ref } from "../common/ref.js";
import type { Definition } from "./definition.js";
import type { Projectile, Id, View } from "./projectile.js";

export class Projectiles {
    static readonly #empty = new Projectiles(Store.empty<Id, View>());

    readonly #entries: Store<Id, View>;

    private constructor(entries: Store<Id, View>) {
        this.#entries = entries;
    }

    static empty(): Projectiles {
        return Projectiles.#empty;
    }

    get size(): number {
        return this.#entries.size;
    }

    get<P extends View>(reference: Ref<P>): P | undefined;
    get(id: Id): View | undefined;
    get<S extends object>(id: Id, definition: Definition<S>): Projectile<S> | undefined;
    get<S extends object, P extends View>(
        identity: Id | Ref<P>,
        definition?: Definition<S>,
    ): View | Projectile<S> | P | undefined {
        const id = typeof identity === "number" ? identity : identity.id;
        const projectile = this.#entries.get(id);

        if (typeof identity !== "number") {
            return projectile;
        }
        if (definition === undefined) {
            return projectile;
        }

        const restored: Projectile<S> | undefined =
            projectile?.definition === definition ? (projectile as Projectile<S>) : undefined;

        return restored;
    }

    read<R>(id: Id, reader: <S extends object>(projectile: Projectile<S>) => R): R | undefined {
        const projectile = this.#entries.get(id);

        return projectile === undefined ? undefined : reader(projectile as Projectile<object>);
    }

    values(): Query<View> {
        return this.#entries.values();
    }

    keys(): Query<Id> {
        return this.#entries.keys();
    }

    add<S extends object>(projectile: Projectile<S>): Projectiles {
        return new Projectiles(this.#entries.add(projectile.id, projectile));
    }

    replace<S extends object>(
        reference: Ref<Projectile<S>>,
        projectile: NoInfer<Projectile<S>>,
    ): Projectiles {
        const entries = this.#entries.replace(reference.id, projectile);

        return entries === this.#entries ? this : new Projectiles(entries);
    }

    remove(id: Id): Projectiles {
        return new Projectiles(this.#entries.remove(id));
    }
}
