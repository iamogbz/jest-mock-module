import rewire from "rewire"
const index = rewire("./index")
const isFunction = index.__get__("isFunction")
const isPlainObject = index.__get__("isPlainObject")
// @ponicode
describe("isFunction", () => {
    test("0", () => {
        let callFunction: any = () => {
            isFunction(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            isFunction(true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            isFunction("callback detected, not supported yet")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            isFunction(-100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            isFunction(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            isFunction(NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("isPlainObject", () => {
    test("0", () => {
        let callFunction: any = () => {
            isPlainObject(0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            isPlainObject(true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            isPlainObject({ This: "is", an: "object", Do: 0, you: 1, Like: 2, it: 10000 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            isPlainObject(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            isPlainObject("something.example.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            isPlainObject(NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.isMockObject", () => {
    test("0", () => {
        let callFunction: any = () => {
            index.isMockObject(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.extend", () => {
    test("0", () => {
        let callFunction: any = () => {
            index.extend("^5.0.0")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            index.extend({ key5: -5.48, key4: 1, spyOnProp: "2021-07-29T20:12:53.196Z" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            index.extend(12)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            index.extend("v4.0.0-rc.4")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            index.extend(true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            index.extend({ key5: Infinity, key4: Infinity, spyOnProp: "" })
        }
    
        expect(callFunction).not.toThrow()
    })
})
