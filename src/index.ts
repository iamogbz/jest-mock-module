import { SpyOnProp } from "jest-mock-props";
import {
  AnyObject,
  CreateSpyOn,
  ExtendJest,
  MockObject,
  Spy,
} from "../typings/globals";
import { mapObject } from "./utils";

const SpyMockProp = Symbol("__mock__");

type JestSpyInstance = {
  spyOn: typeof jest.spyOn;
  spyOnProp: SpyOnProp;
} & Partial<typeof jest>;

function isFunction<T>(o: T): boolean {
  return typeof o === "function";
}

function isPlainObject<T>(o: T): o is T & AnyObject {
  return typeof o == "object" && (o as AnyObject)?.constructor == Object;
}

export function spyOnProp<T>(
  jestInstance: JestSpyInstance,
  object: T,
  propName: keyof T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (isFunction(object[propName])) {
    return jestInstance.spyOn(
      object,
      propName as jest.FunctionPropertyNames<Required<T>>,
    );
  }
  if (isPlainObject(object[propName])) {
    return spyOnObject(jestInstance, object[propName]);
  }
  try {
    return jestInstance.spyOnProp(object, propName);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn((e as Error).message);
    return object[propName];
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
  const spy: Spy = <T>(moduleName: string) => {
    const spied = createSpyFromModule<T>(moduleName);
    jest.mock(moduleName, () => spied);
    return spied;
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
    spyOn: <T>(object: T, propName: keyof T, accessType: "get" | "set") => {
      if (!propName) return spyOnObject({ spyOn, spyOnProp }, object);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return spyOn(object, propName as any, accessType as any);
    },
  });
};

export * from "../typings/globals";
