import { extend, spyOnObject } from "src/index";
extend(jest);
jest.spy("tests/mocks/hello");

import { say, shout } from "./mocks/hello";
import sayHello from "./mocks/index";

afterEach(jest.clearAllMocks);

it("spys on methods called", () => {
    expect(sayHello("You")).toEqual("HELLO YOU!");
    expect(say).toHaveBeenCalledTimes(1);
    expect(shout).toHaveBeenCalledTimes(1);
    ((say as unknown) as jest.SpyInstance).mockImplementationOnce(
        () => "something",
    );
    expect(sayHello("Who")).toEqual("SOMETHING!");
    ((shout as unknown) as jest.SpyInstance).mockImplementationOnce(
        (s: string) => s.toLocaleLowerCase(),
    );
    expect(sayHello("Gru")).toEqual("hello gru");
});
