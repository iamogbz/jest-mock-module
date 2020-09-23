export type MapFn<I, O> = (value: I, index: number, array: I[]) => O;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapObject<K extends keyof any, T, V>(
    o: Record<K, T>,
    callbackfn: MapFn<[K, T], V>,
): Record<K, V> {
    const entries = Object.entries(o) as [K, T][];
    const newValues = entries.map(callbackfn);
    const newObject = {} as Record<K, V>;
    entries.forEach(([key], i) => (newObject[key] = newValues[i]));
    return newObject;
}
