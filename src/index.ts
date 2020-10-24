import { ExtendJest, SpyOn } from "../typings/globals";
import { mapObject } from "./utils";

function spyOnProp<T>(
  jestInstance: typeof jest,
  object: T,
  propName: keyof T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const propValue = object[propName];
  const propType = typeof propValue;
  if (propType === "function") {
    // @ts-expect-error Jest does not play nice
    return jestInstance.spyOn(object, propName);
  }
  if (propType === "object" && propValue !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return spyOnObject(jestInstance, propValue);
  }
  try {
    return jestInstance.spyOnProp(object, propName);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e.message);
    return propValue;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function spyOnObject<T>(jestInstance: typeof jest, o?: T) {
  if (o === undefined || o === null) return o;
  return mapObject(o, ([k]) => spyOnProp(jestInstance, o, k));
}

const attach = (jestInstance: typeof jest): SpyOn => (moduleName) => {
  const actualModule = jestInstance.requireActual(moduleName);
  jestInstance.mock(moduleName, () => spyOnObject(jestInstance, actualModule));
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
  Object.assign(jestInstance, { spy: attach(jestInstance) });
};

export * from "../typings/globals";
