import "jest-mock-props";

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

export type Mock<ObjectType> = {
  [K in keyof ObjectType]: Mock<ObjectType[K]>;
};

export type SpyOn = (moduleName: string) => void;
export type CreateSpyOn = <T = unknown, U = T>(
  moduleName: string,
) => Mapped<T, U> | undefined;

declare global {
  namespace jest {
    const createSpyFromModule: CreateSpyOn;
    const genSpyFromModule: CreateSpyOn;
    const spy: SpyOn;
  }
}

export type ExtendJest = (jestInstance: typeof jest) => void;
