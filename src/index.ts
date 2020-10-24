import { ExtendJest, Mock, Optional, SpyOnModule } from "../typings/globals";
import { mapObject } from "./utils";

function maybeSpyOnProp<T>(object: T, propName: keyof T) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require("jest-mock-props").spyOnProp(object, propName);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e.message);
        return object[propName];
    }
}

function spyOn<T>(object: T, propName: keyof T) {
    const propValue = object[propName];
    const propType = typeof propValue;
    if (propType === "function") {
        // @ts-expect-error Jest does not play nice
        return jest.spyOn(object, propName);
    }
    if (propType === "object") {
        return spyOnObject(propValue);
    }
    return maybeSpyOnProp(object, propName);
}

export function spyOnObject<T>(o?: T): Optional<Mock<T>> {
    if (o === undefined || o === null) return o;
    return mapObject(o, ([k]) => spyOn(o, k));
}

export const spy: SpyOnModule = (moduleName) => {
    const actualModule = jest.requireActual(moduleName);
    jest.mock(moduleName, () => spyOnObject(actualModule));
};

export const extend: ExtendJest = (jestInstance) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require("jest-mock-props").extend(jestInstance);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.info(
            "Install package 'jest-mock-props' to " +
                "spy on non function module properties.",
        );
    }
    Object.assign(jestInstance, { spy });
};

export * from "../typings/globals";
