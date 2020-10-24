export type Optional<ObjectType> = ObjectType | null | undefined;

export type Entry<ObjectType> = {
    [K in keyof ObjectType]: [K, ObjectType[K]];
}[keyof ObjectType];

export type Entries<ObjectType> = Entry<ObjectType>[];

export type Mapped<
    ObjectType,
    ReplacementType extends ObjectType
> = ReplacementType & Omit<ObjectType, keyof ReplacementType>;

export type MapFn<ObjectType, MappedObjectType extends ObjectType> = (
    value: Entry<ObjectType>,
    index: number,
    array: Entries<ObjectType>,
) => MappedObjectType[keyof ObjectType];

export type Mock<ObjectType> = {
    [K in keyof ObjectType]: Mock<ObjectType[K]>;
};

export type SpyOnModule = (moduleName: string) => void;

declare global {
    namespace jest {
        const spy: SpyOnModule;
    }
}

export type ExtendJest = (jestInstance: typeof jest) => void;
