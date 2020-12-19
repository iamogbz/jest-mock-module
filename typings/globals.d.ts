import { MockProp } from "jest-mock-props";

declare const SpyMockProp: unique symbol;

export type Entry<ObjectType> = {
  [K in keyof ObjectType]: [K, ObjectType[K]];
}[keyof ObjectType];

export type Entries<ObjectType> = Entry<ObjectType>[];

export type Mapped<ObjectType, ResultType> = {
  [K in keyof ObjectType]: ResultType;
};

export type MapFn<ObjectType, ResultType> = (
  value: Entry<ObjectType>,
  index: number,
  array: Entries<ObjectType>,
) => Mapped<ObjectType, ResultType>[keyof ObjectType];

type SimplePropertyNames<T> = Exclude<
  jest.NonFunctionPropertyNames<T>,
  ObjectPropertyNames<T>
>;

type ObjectPropertyNames<T> = {
  [K in keyof T]: T[K] extends Record<keyof unknown, unknown> ? K : never;
}[keyof T] &
  string;

export type MockObject<T> = {
  [K in SimplePropertyNames<T>]: MockProp<T>;
} &
  {
    [K in ObjectPropertyNames<T>]: MockObject<T[K]>;
  } &
  {
    [K in jest.FunctionPropertyNames<T>]: ReturnType<typeof jest["spyOn"]>;
  } &
  {
    [K in jest.ConstructorPropertyNames<T>]: ReturnType<typeof jest["spyOn"]>;
  };

type A = jest.NonFunctionPropertyNames<{ a: 2; c: { b: 1 } }>;

export type IsMockObject = <T>(
  o?: T,
) => o is T & { [SpyMockProp]?: MockObject<T> };

export type CreateSpyOn = <T = unknown, U = T>(
  moduleName: string,
) => Mapped<T, U> | undefined;

export type SpyOn = (moduleName: string) => void;
export type SpyOnObject = <T = unknown>(o?: T) => MockObject<T> | undefined;

declare global {
  namespace jest {
    const isMockObject: IsMockObject;
    const createSpyFromModule: CreateSpyOn;
    const genSpyFromModule: CreateSpyOn;
    const spy: SpyOn;
    function spyOn<T>(object: T): Mock<T>;
    const spyOnObject: SpyOnObject;
  }
}

export type ExtendJest = (jestInstance: typeof jest) => void;
