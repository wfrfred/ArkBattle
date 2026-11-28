export function record(value: unknown, name: string): Readonly<Record<string, unknown>> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Readonly<Record<string, unknown>>;
}

export function denseArray(value: unknown, name: string): readonly unknown[] {
    if (!Array.isArray(value)) {
        throw new TypeError(`${name} must be an array`);
    }

    for (let index = 0; index < value.length; index++) {
        if (!Object.hasOwn(value, index) || value[index] === undefined) {
            throw new TypeError(`${name} must be dense`);
        }
    }

    return value;
}

export function string(value: unknown, name: string): string {
    if (typeof value !== "string") {
        throw new TypeError(`${name} must be a string`);
    }

    return value;
}

export function nonemptyString(value: unknown, name: string): string {
    if (typeof value !== "string" || value.length === 0) {
        throw new TypeError(`${name} must be nonempty`);
    }

    return value;
}

export function boolean(value: unknown, name: string): boolean {
    if (typeof value !== "boolean") {
        throw new TypeError(`${name} must be boolean`);
    }

    return value;
}
