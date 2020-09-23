import { extend } from "src/index";
extend(jest);
jest.spy("/Users/Emmanuel/Sources/jest-mock-module/tests/index.mock");

import sayHello, { say, shout } from "./index.mock";

afterEach(jest.clearAllMocks);

it("spys on methods called", () => {
    expect(sayHello("You")).toEqual("HELLO YOU!");
    expect(say).toHaveBeenCalledTimes(1);
    expect(shout).toHaveBeenCalledTimes(1);
    ((say as unknown) as jest.SpyInstance).mockImplementationOnce(
        () => "something",
    );
    expect(sayHello("Who")).toEqual("SOMETHING");
    ((shout as unknown) as jest.SpyInstance).mockImplementationOnce(
        (s: string) => s.toLocaleLowerCase(),
    );
    expect(sayHello("Gru")).toEqual("hello gru!");
});
