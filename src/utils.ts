import { Entries, MapFn, Mapped } from "../typings/globals";

/**
 * Only maps on the string properties using Object.entries
 * @param o the object to map on
 * @param callbackfn the function to be called with object entries returning new value
 */
export function mapObject<ObjectType extends object, ResultType>(
  o: ObjectType,
  callbackfn: MapFn<ObjectType, ResultType>,
): Mapped<ObjectType, ResultType> {
  const entries = Object.entries(o) as Entries<ObjectType>;
  const newValues = entries.map(callbackfn);
  const newObject = {} as Mapped<ObjectType, ResultType>;
  entries.forEach(([key], i) => (newObject[key] = newValues[i]));
  return newObject;
}
