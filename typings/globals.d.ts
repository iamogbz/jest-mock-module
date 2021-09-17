import { MockProp } from "jest-mock-props";

declare const SpyMockProp: unique symbol;

export type AnyObject = Record<string, unknown>;

export type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

export type Entries<T> = Entry<T>[];

export type Mapped<T, U> = {
  [K in keyof T]: U;
};

export type MapFn<T, U> = (
  value: Entry<T>,
  index: number,
  array: Entries<T>,
) => Mapped<T, U>[keyof T];

type NonMappableTypes =
  | bigint
  | boolean
  | unknown[]
  | null
  | number
  | string
  | symbol
  | undefined;
type NonMappablePropertyNames<T> = {
  [K in keyof T]: T[K] extends NonMappableTypes ? K : never;
}[keyof T] &
  string;

type ObjectPropertyNames<T> = Exclude<
  keyof T,
  | jest.FunctionPropertyNames<T>
  | jest.ConstructorPropertyNames<T>
  | NonMappablePropertyNames<T>
>;

export type MockObject<T> = {
  [K in NonMappablePropertyNames<T>]: MockProp<T, K>;
} & {
  [K in ObjectPropertyNames<T>]: MockObject<T[K]>;
} & {
  [K in jest.FunctionPropertyNames<T>]: Required<T>[K] extends (
    ...args: never[]
  ) => unknown
    ? jest.SpyInstance<
        ReturnType<Required<T>[K]>,
        jest.ArgsType<Required<T>[K]>
      >
    : never;
} & {
  [K in jest.ConstructorPropertyNames<T>]: Required<T>[K] extends new (
    ...args: never[]
  ) => unknown
    ? jest.SpyInstance<
        InstanceType<Required<T>[K]>,
        jest.ConstructorArgsType<Required<T>[K]>
      >
    : never;
};

export type IsMockObject = <T>(
  o: T,
) => o is T & { [SpyMockProp]?: MockObject<T> };

export type CreateSpyOn = <T = unknown, U = T>(
  moduleName: string,
) => Mapped<T, U> | undefined;

export type Spy = (moduleName: string) => void;

declare global {
  namespace jest {
    const isMockObject: IsMockObject;
    const createSpyFromModule: CreateSpyOn;
    const genSpyFromModule: CreateSpyOn;
    const spy: Spy;
    function spyOn<T>(object: T): MockObject<T>;
    const spyOnObject: typeof spyOn;
  }
}

export type ExtendJest = (jestInstance: typeof jest) => void;
