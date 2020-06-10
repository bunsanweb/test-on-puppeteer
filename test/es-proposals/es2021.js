describe("ES2021", function () {
  it("String.replaceAll()", function () {
    chai.assert.equal("a+b+c+d".replaceAll("+", "-"), "a-b-c-d");
    chai.assert.equal("abc".replaceAll("", "-"), "-a-b-c-");
    chai.assert.equal("a-b-c".replaceAll(/-/g, "+"), "a+b+c");
    chai.expect(_ => "a-b-c".replaceAll(/-/, "+")).to.throw();
  });
  it("numeric eparator _", function () {
    chai.assert.equal(1_2_3, 123);
    chai.assert.equal(0b10_11_00, 0b101100);
    chai.assert.equal(0xff_cd, 0xffcd);
  });
  it("field declarations in class", function () {
    const c = class {
      f = 1;
    };
    chai.assert.equal(new c().f, 1);
    const d = class extends c {
      f = 2;
    };
    chai.assert.equal(new d().f, 2);
  });
  it.skip("private method/field", function () {
    /* firefox not yet supported
    const c = class {
      #pf = 1;
      #pm() {return this.#pf + 1;}
      pub() {return this.#pm();}
    };
    //*/
  });
  it.skip("static field declarations in class", function () {
    /* webkit not yet supported
    const b = class {
      static s = 10;
    };
    chai.assert.equal(b.s, 10);    
    //*/   
  });
});
