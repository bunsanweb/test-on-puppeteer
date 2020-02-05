// mocha test code
describe("ES2019", function () {
  it("optional catch", function () {
    try {
      throw "error";
      chai.assert.fail();
    } catch {
      chai.assert.isOk(true);
    }
  });
  it(`syntax allows \\u2028 and \\u2029`, function () {
    chai.assert.doesNotThrow(Function(`return {foo: "\u2028"}`));
    chai.assert.doesNotThrow(Function(`return {foo: "\u2029"}`));
  });
  it("Symbol.description", function () {
    chai.assert.equal(Symbol("foo").description, "foo");
    chai.assert.equal(Symbol.for("bar").description, "bar");
    chai.assert.equal(Symbol.iterator.description, "Symbol.iterator");
  });
  it("Function.toStrig() from source code slice", function () {
    chai.assert.equal(((a, b,  )  =>{ }).toString(), "(a, b,  )  =>{ }");
    // webkit fails space counts between function and ( as single
    //chai.assert.equal((function  (a, b,  ){ }).toString(), "function  (a, b,  ){ }");
  });
  it("Object.fromENtries()", function () {
    const o = {foo: 1, bar: "a", buzz: true};
    chai.assert.deepEqual(Object.fromEntries(Object.entries(o)), {foo: 1, bar: "a", buzz: true});
    
    const m = new Map();
    m.set("foo", 1);
    m.set("bar", "a");
    m.set("buzz", true);
    chai.assert.deepEqual(Object.fromEntries(m.entries()), {foo: 1, bar: "a", buzz: true});
  });
  it("ilformed surrogate pair on JSON.stringify()", function () {
    chai.assert.equal(JSON.stringify("\uDF06\uD834"), `"\\udf06\\ud834"`);
  });
  it("String.trimStart()/trimEnd()", function () {
    chai.assert.equal(" \n abc def \t ".trimStart(), "abc def \t ");
    chai.assert.equal(" \n abc def \t ".trimEnd(), " \n abc def");
  });
  it("Array.flat()/flatMap()", function () {
    chai.assert.deepEqual([[[1]], [[2], [3]]].flat(), [[1], [2], [3]]);
    chai.assert.deepEqual([[[1]], [[2], [3]]].flat().flat(), [1, 2, 3]);
    chai.assert.deepEqual([1, [2], [3]].flat(), [1, 2, 3]);

    chai.assert.deepEqual(["abc def", "ghi"].flatMap(s => s.split(" ")), ["abc", "def", "ghi"]);
  });
});
