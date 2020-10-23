import { ValueOf } from "jest-mock-props/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;
export type AnyObject = object & AnyRecord;
export type Mock<O> = {
    [K in string]: Mock<ValueOf<O>>;
};

declare global {
    namespace jest {
        function spy(moduleName: string): void;
    }
}
