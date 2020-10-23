import { ValueOf } from "jest-mock-props/lib/types";

export type Mock<O> = {
    [K in keyof O]: Mock<ValueOf<O>>;
};

declare global {
    namespace jest {
        function spy(moduleName: string): void;
    }
}
