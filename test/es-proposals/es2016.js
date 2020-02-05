// mocha test code
describe("ES2016", function () {
  it("Array.includes()", function () {
    chai.assert.isOk([1,2,3].includes(2));
    chai.assert.isNotOk([1,2,3].includes(0));
    const o = {};
    chai.assert.isOk([o].includes(o));
    chai.assert.isNotOk([o].includes({}));
    chai.assert.isNotOk([{}].includes(o));
    chai.assert.isNotOk([{}].includes({}));
  });
  it("A ** B", function () {
    chai.assert.equal(2 ** 4, 16);
    chai.assert.equal(2.5 ** 4, Math.pow(2.5, 4));
    chai.assert.equal(2.5 ** 4.5, Math.pow(2.5, 4.5));
    chai.assert.throws(() => new Function("-2 ** 4"), SyntaxError);
  });
});
