export const MochaConsoleReporter = class {
  constructor(runner) {
    const state = {
      start: 0, 
      suites: 0, tests: 0, passes: 0, fails: 0,
    };
    
    runner.on("start", () => {
      state.start = Date.now();
    });
    runner.on("end", () => {
      const msec = Date.now() - state.start;
      
      console.info("Total", state.suites, "suites");
      console.info("Total", state.tests, "tests");
      console.info("Test passes:", state.passes);
      if (state.fails) console.error("Test fails:", state.fails);
      else console.info("Test fails:", state.fails);
      console.info("duration:", msec / 1000, "s");
    });
    // waiting/ready: when delay option
    runner.on("waiting", () => {
    });
    runner.on("ready", () => {
    });    
    
    runner.on("suite", suite => {
      state.suites++;
      // skip root suite
      if (state.suites !== 1) console.info("Run suite:", suite.title);
    });
    runner.on("suite end", suite => {
    });

    // brefore/after/beforeEach/afterEach: as hook
    runner.on("hook", hook => {
    });
    runner.on("hook end", hook => {
    });
    
    runner.on("test", test => {
      state.tests++;
      console.info("Run test:", test.title);
    });
    runner.on("test end", test => {
      
    });

    // test results
    runner.on("pass", test => {
      state.passes++;
    });
    runner.on("fail", (test, error) => {
      state.fails++;
      
      console.assert(
        false, `${test.parent.title} - ${test.title}\n`,
        "- expected", error.expected, "\n",
        "- actual:", error.actual, "\n",
        error.stack);
    });
    
    // it.skip()/test.skip():
    runner.on("pending", test => {
    });
    // with retry count?
    runner.on("retry", (test, error) => {
    });
  }
};
