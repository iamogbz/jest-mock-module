# Jest Mock Module

[![Dependabot badge](https://badgen.net/github/dependabot/iamogbz/jest-mock-module/?icon=dependabot)](https://app.dependabot.com)
[![Dependencies](https://img.shields.io/librariesio/github/iamogbz/jest-mock-module)](https://github.com/iamogbz/jest-mock-module)
[![Build Status](https://github.com/iamogbz/jest-mock-module/workflows/Build/badge.svg)](https://github.com/iamogbz/jest-mock-module/actions)
[![Coverage Status](https://coveralls.io/repos/github/iamogbz/jest-mock-module/badge.svg?branch=refs/heads/master)](https://coveralls.io/github/iamogbz/jest-mock-module)
[![NPM Version](https://img.shields.io/npm/v/jest-mock-module.svg)](https://www.npmjs.com/package/jest-mock-module)

Extends jest to allow deep auto mocking of a module by spying on all functions and properties.

## Introduction

### Getting Started

Install the extension using [pnpm](https://pnpm.io/installation), [npm](https://docs.npmjs.com/cli/install.html), [yarn](https://yarnpkg.com/en/docs/usage) etc.

```sh
npm install -D "jest-mock-module"
```

### The Jest Object

The jest object needs to be extended in every test file. This allows access to the `jest-mock-module` api.

#### `jest.spy(moduleName)`

This works like [jest.doMock][jest-do-mock].

The main difference is a factory does not need to be provided as it automatically generates one using [`jest.createSpyFromModule`](#jestcreatespyfrommodulemodulename).

Internally uses [`jest.mock`][jest-mock] so works with other `jest` mocking methods.

#### `jest.createSpyFromModule(moduleName)`

This works like [jest.createMockFromModule][jest-create-mock].

The main difference is the returned mock is created using [`jest.spyOnObject`](#jestspyonobjectobject).

#### `jest.spyOnObject(object)`

This creates a deep mock of the object spying on all the internal properties using [jest-spy-on][jest-spyon-props].

### Example Usage

```js
// src/example.js
module.exports = {
  testing: "123";
  nested: {
    test: () => true;
    testing: "456";
  }
}
```

```js
import * as mock from "jest-mock-module";
mock.extend(jest);

// Only to be used on valid modules
jest.spy("src/example");

// Since babel-jest does not hoist jest.spy
// import calls need to come after the spy mock
const example = require("src/example");

// Check module object properties
jest.isMockProp(example, "testing"); // true
console.log(example.testing); // 123

// Respy on module object to get mockable
jest.spyOn(example).testing.mockValueOnce("789");
console.log(example.testing); // 789
console.log(example.testing); // 123

// Check module nested object properties
jest.isMockMethod(example.nested.test); // true
jest.isMockProp(example.nested, "testing"); // true
```

It keeps the same structure of the module but replaces all functions and properties with jest mocks.

- `jest.createSpyFromModule` is exported and can be used like [`jest.createMockFromModule`][jest-create-mock]. It is used internally by `jest.spy` in combination with `jest.mock` to provide a factory in place of Jest's automocking feature.

#### References

- [`jest-spy-on`][jest-spyon-method] - Guide to spying on module methods
- [`jest-mock-props`][jest-spyon-props] - Guide to spying on object properties

[jest-spyon-method]: https://jestjs.io/docs/en/jest-object#jestspyonobject-methodname
[jest-create-mock]: https://jestjs.io/docs/en/jest-object#jestcreatemockfrommodulemodulename
[jest-do-mock]: https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
[jest-mock]: https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options
[jest-spyon-props]: https://ogbizi.com/jest-mock-props#mock-properties
