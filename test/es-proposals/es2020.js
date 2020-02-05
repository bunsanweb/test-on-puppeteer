// mocha test code
describe("ES2020", function () {
  it("import()", function (done) {
    (async () => {
      const mod = await import("./mocha-console-reporter.js");
      chai.assert.isOk(mod);
      chai.assert.isOk(mod.MochaConsoleReporter);
    })().then(done, done);
  });
  it.skip("BigInt", function () {
    //webkit not support bigint syntax
    chai.assert.isOk(BigInt);
    //chai.assert.equal(1n + 1n, 2n);
    //chai.assert.equal(10n ** 20n, 100000000000000000000n);
  });
  it("globalThis", function () {
    chai.assert.isOk(globalThis);
    chai.assert.equal(globalThis, window);
  });
  it("for-in key order", function () {
    const r = [];
    for (const k in {foo: 1, bar: "a", buzz: true}) r.push(k);
    chai.assert.deepEqual(r, ["foo", "bar", "buzz"]);
  });
  it.skip("O?.p", function () {
    //firefox not support ?. operator syntax
    const o1 = null;
    //chai.assert.strictEqual(o1?.foo, undefined);
  });
  it("A ?? B", function () {
    chai.assert.equal(0 ?? 2, 0);
    chai.assert.equal(false ?? 2, false);
    chai.assert.equal(null ?? "a", "a");
    chai.assert.equal(undefined ?? "a", "a");
  });
});
