import { AnyObject, Mock } from "./types";
import { mapObject } from "./utils";

function maybeSpyOnProp(object: AnyObject, propName: string) {
    try {
        return require("jest-mock-props").spyOnProp(object, propName);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Failed to spy on property:", propName);
        return object[propName];
    }
}

export function spyOn(object: AnyObject, propName: string) {
    const propValue = object[propName];
    let spyInstance;
    if (typeof propValue === "function") {
        spyInstance = jest.spyOn(object, propName);
    } else if (typeof propValue === "object") {
        spyInstance = {};
    } else {
        spyInstance = maybeSpyOnProp(object, propName);
    }
    if (!spyInstance) return;
    return Object.assign(spyInstance, spyOnObject(propValue));
}

export function spyOnObject<T extends AnyObject>(o?: T): Mock<T> | undefined {
    if (o === undefined || o === null) return o;
    return mapObject(o, ([k]) => spyOn(o, k));
}

export function spy(moduleName: string): void {
    const actualModule = jest.requireActual(moduleName);
    jest.mock(moduleName, () => spyOnObject(actualModule));
}

export function extend(jestInstance: typeof jest): void {
    try {
        require("jest-mock-props").extend(jest);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.info(
            "Install package 'jest-mock-props' to " +
                "spy on non function module properties.",
        );
    }
    Object.assign(jestInstance, { spy });
}
