import { ExtendJest, Mock, Optional, SpyOnModule } from "../typings/globals";
import { mapObject } from "./utils";

function maybeSpyOnProp<T>(object: T, propName: keyof T) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require("jest-mock-props").spyOnProp(object, propName);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(
            `Failed to spy on property ${propName}.`,
            "You might be missing the 'jest-mock-props' peer dependency.",
        );
        return object[propName];
    }
}

function spyOn<T>(object: T, propName: keyof T) {
    const propValue = object[propName];
    let spyInstance;
    if (typeof propValue === "function") {
        // @ts-expect-error Jest does not play nice
        spyInstance = jest.spyOn(object, propName);
    } else if (typeof propValue === "object") {
        spyInstance = {};
    } else {
        spyInstance = maybeSpyOnProp(object, propName);
    }
    if (!spyInstance) return;
    return Object.assign(spyInstance, spyOnObject(propValue));
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
        require("jest-mock-props").extend(jest);
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
