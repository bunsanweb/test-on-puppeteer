describe("ES2021", function () {
  it("String.replaceAll()", function () {
    chai.assert.equal("a+b+c+d".replaceAll("+", "-"), "a-b-c-d");
    chai.assert.equal("abc".replaceAll("", "-"), "-a-b-c-");
    chai.assert.equal("a-b-c".replaceAll(/-/g, "+"), "a+b+c");
    chai.expect(_ => "a-b-c".replaceAll(/-/, "+")).to.throw();
  });
  it("Promise.any()", function (done) {
    (async () => {
      const v = await Promise.any([
        Promise.reject(0),
        new Promise(f => setTimeout(f, 10, 1)),
      ]);
      chai.assert.equal(v, 1);      
    })().then(done, done);
  });
  it("numeric sparator _", function () {
    chai.assert.equal(1_2_3, 123);
    chai.assert.equal(0b10_11_00, 0b101100);
    chai.assert.equal(0xff_cd, 0xffcd);
  });
  it("a ||= b, a &&= b, a ??= b", function () {
    let a1 = 0, a2 = 1;
    a1 ||= 10, a2 ||= 10;
    chai.assert.equal(a1, 10);
    chai.assert.equal(a2, 1);
    
    let b1 = 0, b2 = 1;
    b1 &&= 10, b2 &&= 10;
    chai.assert.equal(b1, 0);
    chai.assert.equal(b2, 10);

    let c1 = 0, c2 = null;
    b1 ??= 10, c2 ??= 10;
    chai.assert.equal(c1, 0);
    chai.assert.equal(c2, 10);
  });
  it.skip("WeakRef", function () {
    // WeakRef is not implemented in WebKit-14
    chai.assert.isOk(WeakRef);
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
