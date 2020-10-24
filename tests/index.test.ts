import "jest-mock-props";
import { extend, spyOnObject } from "src/index";
extend(jest);
afterEach(jest.clearAllMocks);

it("spies on methods called", () => {
    jest.spy("tests/mocks/hello");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { say, shout } = require("./mocks/hello");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sayHello = require("./mocks/index").default;

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

it("spies on object nested properties", () => {
    const obj = {
        prop1: 1,
        prop2: "two",
        propFn(something: string) {
            return `say ${something}`;
        },
        nested: {
            propA: null,
            propB: true,
        },
    };
    const spied = spyOnObject(jest, obj);
    if (!spied) fail("Expect spied to be defined and not null");
    expect(obj).toMatchSnapshot();
    expect(jest.isMockProp(obj, "prop1")).toBe(true);
    expect(jest.isMockProp(obj, "prop2")).toBe(true);
    expect(jest.isMockFunction(obj.propFn)).toBe(true);
    expect(jest.isMockProp(obj, "nested")).toBe(false);
    expect(jest.isMockProp(obj.nested, "propA")).toBe(true);
    expect(jest.isMockProp(obj.nested, "propB")).toBe(true);
});
