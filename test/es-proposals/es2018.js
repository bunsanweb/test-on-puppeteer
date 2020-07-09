// mocha test code
describe("ES2018", function () {
  it("template literals/String.raw", function () {
    chai.assert.equal(String.raw`\unicode`, "\\unicode");
    chai.assert.equal(String.raw`\xaa`, "\\xaa");
    chai.assert.equal(`\xaa`, "\xaa");
  });
  it("/.../s", function () {
    chai.assert.isOk(/foo.bar/.test("foo bar"));
    chai.assert.isNotOk(/foo.bar/.test("foo\nbar"));
    chai.assert.isOk(/foo.bar/s.test("foo\nbar"));
  });
  it("/(?<name>...)/", function () {
    const r = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
    const capture = r.exec("2020-02-01").groups;
    chai.assert.deepEqual(capture, {year: "2020", month: "02", day: "01"});
  });
  it("{...o}", function () {
    const o1 = {foo: 1, bar: "a", buzz: true};
    chai.assert.deepEqual(
      {abc: null, ...o1, quux: []},
      {abc: null, foo: 1, bar: "a", buzz: true, quux: []});

    const {foo, buzz, ...o2} = o1;
    chai.assert.deepEqual(o2, {bar: "a"});
  });
  it.skip("/(?<=...).../, /(?<!...).../", function () {
    // WebKit<=14: not support look-behind patterns yet
    //chai.assert.isOk(/(?<!-)\d{4}/.test("1234"));
    //chai.assert.isNotOk(/(?<!-)\d{4}/.test("-1234"));
    //chai.assert.isOk(/(?<=-)\d{4}/.test("-1234"));
    //chai.assert.isNotOk(/(?<=-)\d{4}/.test("1234"));
  });
  it("//\p{...=...}.../u", function () {
    chai.assert.isOk(/\p{Script=Hiragana}/u.test("あ"));
  });
  it("Promise.finary()", function (done) {
    (async () => {
      {
        const p1 = (async () => {throw "error";})();
        let pass = false;
        const p2 = p1.finally(() => {pass = true;});
        try {
          await p2;
          chai.assert.fail();
        } catch (error) {}
        chai.assert.isOk(pass);
      }
      {
        const p1 = (async () => {return 1;})();
        let pass = false;
        const p2 = p1.finally(() => {pass = true;});
        await p2;
        chai.assert.isOk(pass);
      }
    })().then(done, done);
  });
  it("async generator/for-await-of loop", function (done) {
    chai.assert.equal(typeof Symbol.asyncIterator, "symbol");

    const gen = async function* () {
      yield Promise.resolve(1);
      yield await Promise.resolve(2);
      yield 3;
    };
    const g = gen();
    chai.assert.equal(typeof g[Symbol.asyncIterator], "function");
    
    (async () => {
      const r = [];
      for await (const v of g) r.push(v);
      chai.assert.deepEqual(r, [1, 2, 3]);
    })().then(done, done);
  });
});
