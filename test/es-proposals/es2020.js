// mocha test code
describe("ES2020", function () {
  it("import()", function (done) {
    (async () => {
      const mod = await import("./mocha-console-reporter.js");
      chai.assert.isOk(mod);
      chai.assert.isOk(mod.MochaConsoleReporter);
    })().then(done, done);
  });
  it("import.meta", function (done) {
    (async () => {
    chai.assert.isOk(import.meta);
    })().then(done, done);
  });
  it("BigInt", function () {
    chai.assert.isOk(BigInt);
    chai.assert.equal(1n + 1n, 2n);
    chai.assert.equal(10n ** 20n, 100000000000000000000n);
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
  it("O?.p", function () {
    const o1 = null;
    chai.assert.strictEqual(o1?.foo, undefined);
    const o2 = "";
    chai.assert.strictEqual(o2?.length, 0);
  });
  it("A ?? B", function () {
    chai.assert.equal(0 ?? 2, 0);
    chai.assert.equal(false ?? 2, false);
    chai.assert.equal(null ?? "a", "a");
    chai.assert.equal(undefined ?? "a", "a");
  });
  it("Promise.allSettled()", function (done) {
    (async () => {
      const r = await Promise.allSettled([
        Promise.resolve(1),
        Promise.reject("a"),
      ]);
      chai.assert.equal(r.length, 2);
      chai.assert.equal(r[0].status, "fulfilled");
      chai.assert.equal(r[0].value, 1);
      chai.assert.equal(r[1].status, "rejected");
      chai.assert.equal(r[1].reason, "a");
    })().then(done, done);
  });
  it("String.matchAll()", function () {
    // no-sideeffect repeated RegExp.exec(s)
    const r = /(\w+)/g;
    const s = "abc def ghi";
    const matches = [...s.matchAll(r)]; // iterator to Array
    chai.assert.equal(matches.length, 3);
    chai.assert.equal(matches[0][0], "abc");
    chai.assert.equal(matches[0].index, 0);
    chai.assert.equal(matches[1][0], "def");
    chai.assert.equal(matches[1].index, 4);
    chai.assert.equal(matches[2][0], "ghi");
    chai.assert.equal(matches[2].index, 8);
    // `r[Symbol.matchAll](s)` is same as `s.matchAll(r)`
    chai.assert.equal(typeof r[Symbol.matchAll], "function");
  });
});
