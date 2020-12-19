import "jest-mock-props";
import * as utils from "src/utils";
import { extend, isMockObject, spyOnModule } from "src/index";

extend(jest);
jest.spyOn(utils, "mapObject");
afterEach(jest.clearAllMocks);

it("reuses existing spy when there is one", () => {
  const moduleName = "tests/mocks/hello";
  expect(jest.createSpyFromModule(moduleName)).toBe(
    spyOnModule(jest, moduleName),
  );
  expect(utils.mapObject).toBeCalledTimes(1);
});

it("spies on methods called", () => {
  jest.spy("tests/mocks/hello");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const hello = require("./mocks/hello");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sayHello = require("./mocks/index").default;

  expect(isMockObject(hello)).toBe(true);
  expect(hello.CALL).toEqual("Hello");
  jest.spyOnObject(hello)?.CALL.mockValueOnce("Hi");
  expect(sayHello("You")).toEqual("HI YOU!");
  expect(sayHello("You")).toEqual("HELLO YOU!");
  expect(hello.say).toHaveBeenCalledTimes(2);
  expect(hello.shout).toHaveBeenCalledTimes(2);
  ((hello.say as unknown) as jest.SpyInstance).mockImplementationOnce(
    () => "something",
  );
  expect(sayHello("Who")).toEqual("SOMETHING!");
  ((hello.shout as unknown) as jest.SpyInstance).mockImplementationOnce(
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
    list: [{ propX: 2 }],
  };
  const spied = jest.spyOn(obj);
  if (!spied) fail("Expect spied to be defined and not null");
  expect(obj).toMatchSnapshot();
  expect(jest.isMockProp(obj, "prop1")).toBe(true);
  expect(jest.isMockProp(obj, "prop2")).toBe(true);
  expect(jest.isMockFunction(obj.propFn)).toBe(true);
  expect(jest.isMockProp(obj, "list")).toBe(true);
  expect(jest.isMockProp(obj, "nested")).toBe(false);
  expect(jest.isMockProp(obj.nested, "propA")).toBe(true);
  expect(jest.isMockProp(obj.nested, "propB")).toBe(true);

  spied.list.mockValueOnce([]);
  expect(obj.list).toHaveLength(0);
  expect(obj.list).toHaveLength(1);

  // @ts-expect-error allow assignment
  spied.nested.propA.mockValueOnce(1);
  expect(obj.nested.propA).toEqual(1);
  expect(obj.nested.propA).toBeNull();

  spied.propFn.mockReturnValueOnce("Fake");
  expect(obj.propFn("hey")).toEqual("Fake");
  expect(obj.propFn("hey")).toEqual("say hey");
  expect(spied.propFn).toHaveBeenCalledTimes(2);
});
