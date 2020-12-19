import { SpyOnProp } from "jest-mock-props";
import { CreateSpyOn, ExtendJest, MockObject, SpyOn } from "../typings/globals";
import { mapObject } from "./utils";

const SpyMockProp = Symbol("__mock__");

type JestSpyInstance = {
  spyOn: typeof jest.spyOn;
  spyOnProp: SpyOnProp;
} & Partial<typeof jest>;

export function spyOnProp<T>(
  jestInstance: JestSpyInstance,
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

export function isMockObject<T>(
  o?: T,
): o is T & { [SpyMockProp]: MockObject<T> } {
  return !!o && Object.prototype.hasOwnProperty.call(o, SpyMockProp);
}

export function spyOnObject<T>(
  jestInstance: JestSpyInstance,
  o: T,
): MockObject<T> {
  if (isMockObject(o)) return o[SpyMockProp];
  return mapObject(o, ([k]) => spyOnProp<T>(jestInstance, o, k));
}

export function spyOnModule<T>(
  jestInstance: typeof jest,
  moduleName: string,
): T & { [SpyMockProp]?: MockObject<T> } {
  const actual = jestInstance.requireActual<T>(moduleName);
  return Object.assign(actual, {
    [SpyMockProp]: spyOnObject<T>(jestInstance, actual),
  });
}

function bind(jestInstance: typeof jest) {
  const createSpyFromModule: CreateSpyOn = <T>(moduleName: string) => {
    return spyOnModule<T>(jestInstance, moduleName);
  };
  const spy: SpyOn = (moduleName: string) => {
    jest.mock(moduleName, () => createSpyFromModule(moduleName));
  };
  return {
    createSpyFromModule,
    genSpyFromModule: createSpyFromModule,
    spy,
    spyOnObject: <T>(o: T) => spyOnObject(jestInstance, o),
  };
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
  const spyOn = jestInstance.spyOn;
  const spyOnProp = jestInstance.spyOnProp;
  Object.assign(jestInstance, bind(jestInstance), {
    isMockObject,
    spyOn: <T>(
      object: T,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      propName: any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessType: any,
    ) => {
      if (!propName) return spyOnObject({ spyOn, spyOnProp }, object);
      return spyOn(object, propName, accessType);
    },
  });
};

export * from "../typings/globals";
