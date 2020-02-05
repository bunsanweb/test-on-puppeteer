// mocha test code
describe("ES2017", function () {
  it("Object.values()", function () {
    chai.assert.deepEqual(Object.values({}), []);
    chai.assert.deepEqual(
      Object.values({foo: 1, bar: "a", buzz: true}), [1, "a", true]);
    
    const o = Object.defineProperty({}, "foo", {enumerable: false, value: 1});
    chai.assert.equal(o.foo, 1);
    chai.assert.deepEqual(Object.values(o), []);
  });
  it("Object.entries()", function () {
    chai.assert.deepEqual(Object.entries({}), []);
    chai.assert.deepEqual(
      Object.entries({foo: 1, bar: "a", buzz: true}),
      [["foo", 1], ["bar", "a"], ["buzz", true]]);
    
    const o = Object.defineProperty({}, "foo", {enumerable: false, value: 1});
    chai.assert.equal(o.foo, 1);
    chai.assert.deepEqual(Object.entries(o), []);
  });
  it("string.padStart()/padEnd()", function () {
    chai.assert.equal("123".padStart(4), " 123");
    chai.assert.equal("12345".padStart(4), "12345");
    chai.assert.equal("123".padStart(4, "0"), "0123");
    chai.assert.equal("123".padStart(8, "ABC"), "ABCAB123");
    
    chai.assert.equal("123".padEnd(4), "123 ");
    chai.assert.equal("12345".padEnd(4), "12345");
    chai.assert.equal("123".padEnd(4, "0"), "1230");
    chai.assert.equal("123".padEnd(8, "ABC"), "123ABCAB");
  });
  it("Object.getOwnPropertyDescriptors()", function () {
    const o = {foo: 1, bar: "a", buzz: true};
    chai.assert.deepEqual(
      Object.getOwnPropertyDescriptors(o),
      {
        foo: {value: 1, writable: true, enumerable: true, configurable: true},
        bar: {value: "a", writable: true, enumerable: true, configurable: true},
        buzz: {value: true, writable: true, enumerable: true, configurable: true},
      });
  });
  it("trailing commas in function", function () {
    chai.assert.doesNotThrow(() => Function("return function (a, b,) {}"));
    chai.assert.doesNotThrow(() => Function("return (a, b,) => {}"));
    chai.assert.doesNotThrow(() => Function("return Math.max(1, 2, 3,)"));
  });
  it("async/await", function (done) {
    (async () => {
      const f1 = async () => {return 1;};
      const p1 = f1();
      chai.assert.instanceOf(p1, Promise);
      const v1 = await p1;
      chai.assert.equal(v1, 1);

      const f2 = async () => {throw "error";};
      const p2 = f2();
      chai.assert.instanceOf(p2, Promise);
      try {
        const v2 = await p2;
        chai.assert.fail();
      } catch (error) {
        chai.assert.equal(error, "error");
      }
    })().then(done, done);
  });
  it.skip("SharedArrayBuffer/Atomics", function () {
    // SharedArrayBuffer is now disabled because of Spectre attack
    const sa = new SharedArrayBuffer(16);
    const ua = new Uint8Array(sa);
    Atomics.store(ua, 0, 255);
    chai.assert.equal(Atomics.load(ua, 0), 255);
  });
});
