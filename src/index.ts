import { CreateSpyOn, ExtendJest, SpyOn } from "../typings/globals";
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
  return mapObject(o, ([k]) => spyOnProp<T>(jestInstance, o, k));
}

function spyOnModule<T>(jestInstance: typeof jest, moduleName: string) {
  const actualModule = jestInstance.requireActual<T>(moduleName);
  return spyOnObject<T>(jestInstance, actualModule);
}

function bind(jestInstance: typeof jest) {
  const createSpyFromModule: CreateSpyOn = <T>(moduleName: string) => {
    return spyOnModule<T>(jestInstance, moduleName);
  };
  const spy: SpyOn = (moduleName: string) => {
    jest.mock(moduleName, () => createSpyFromModule(moduleName));
  };
  return { createSpyFromModule, spy };
}

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
  const bound = bind(jestInstance);
  Object.assign(jestInstance, {
    ...bound,
    genSpyFromModule: bound.createSpyFromModule,
  });
};

export * from "../typings/globals";
