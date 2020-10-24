import { Entries, MapFn, Mapped } from "../typings/globals";

/**
 * Only maps on the string properties using Object.entries
 * @param o the object to map on
 * @param callbackfn the function to be called with object entries returning new value
 */
export function mapObject<ObjectType, MappedObjectType extends ObjectType>(
    o: ObjectType,
    callbackfn: MapFn<ObjectType, MappedObjectType>,
): Mapped<ObjectType, MappedObjectType> {
    const entries = Object.entries(o) as Entries<ObjectType>;
    const newValues = entries.map(callbackfn);
    const newObject = {} as Mapped<ObjectType, MappedObjectType>;
    entries.forEach(([key], i) => (newObject[key] = newValues[i]));
    return newObject;
}
