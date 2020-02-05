// mocha test code
describe("ES2018", function () {
  it("template literals/String.raw", function () {
    chai.assert.equal(String.raw`\unicode`, "\\unicode");
    chai.assert.equal(String.raw`\xaa`, "\\xaa");
    chai.assert.equal(`\xaa`, "\xaa");
  });
  it.skip("/.../s", function () {
    chai.assert.isOk(/foo.bar/.test("foo bar"));
    chai.assert.isNotOk(/foo.bar/.test("foo\nbar"));
    // firefox not support s flag syntax yet
    //chai.assert.isOk(/foo.bar/s.test("foo\nbar"));
  });
  it.skip("/(?<name>...)/", function () {
    // firefox not support named capture group syntax
    //const r = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
    //const capture = r.exec("2020-02-01").groups;
    //chai.assert.deepEqual(capture, {year: "2020", month: "02", day: "01"});
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
    // firefox and wekit not support these regex group syntax
    //chai.assert.isOk(/(?<!-)\d{4}/.test("1234"));
    //chai.assert.isNotOk(/(?<!-)\d{4}/.test("-1234"));
    //chai.assert.isOk(/(?<=-)\d{4}/.test("-1234"));
    //chai.assert.isNotOk(/(?<=-)\d{4}/.test("1234"));
  });
  it.skip("//\p{...=...}.../u", function () {
    // firefox not support unicode property syntax
    //chai.assert.isOk(/\p{Script=Hiragana}/u.test("あ"));
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
  it("for await (const X of ...)", function (done) {
    chai.assert.equal(typeof Symbol.asyncIterator, "symbol");
    
    const newQueue = () => {
      const [gets, polls] = [[], []];
      const next = () => new Promise(
        get => polls.length > 0 ? polls.shift()(get) : gets.push(get));
      const poll = () => new Promise(
        poll => gets.length > 0 ? poll(gets.shift()) : polls.push(poll));
      const push = value => poll().then(get => get({value, done: false}));
      const close = () => poll().then(get => get({done: true}));
      return {[Symbol.asyncIterator]() {return this;}, next, push, close};
    };

    const queue = newQueue();
    
    (async () => {
      queue.push(1);
      queue.push(2);
      queue.push(3);
      queue.close();
      const r = [];
      for await (const v of queue) r.push(v);
      chai.assert.deepEqual(r, [1, 2, 3]);
    })().then(done, done);
  });
});

