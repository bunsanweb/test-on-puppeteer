export const MochaConsoleReporter = class {
  constructor(runner) {
    const state = {
      start: 0, 
      suites: 0, tests: 0, passes: 0, fails: 0, pendings: 0,
    };
    const errors = [];
    
    runner.on("start", () => {
      state.start = Date.now();
    });
    runner.on("end", () => {
      const msec = Date.now() - state.start;
      
      console.info("Total", state.tests, "tests");
      console.info("- pass:", state.passes);
      if (state.pendings) console.warn("- pending:", state.pendings);
      if (state.fails) console.error("- fail:", state.fails);
      else console.info("- fails:", state.fails);
      console.info("duration:", msec / 1000, "s");
      for (const [test, error] of errors) {
        const title = `[${test.parent.title}: ${test.title}] ${error.message}`;
        console.assert(false, `${title}\n`, error.stack);
      }
    });
    // waiting/ready: when delay option
    runner.on("waiting", () => {
    });
    runner.on("ready", () => {
    });    
    
    runner.on("suite", suite => {
      state.suites++;
      if (state.suites === 1) return; // skip root suite
      console.info(`${state.suites - 1}) ${suite.title}`);
    });
    runner.on("suite end", suite => {
    });

    // brefore/after/beforeEach/afterEach: as hook
    runner.on("hook", hook => {
      console.info(`- ${hook.title}`);
    });
    runner.on("hook end", hook => {
    });
    
    runner.on("test", test => {
      state.tests++;
      console.info(`- ${test.title}`);
    });
    runner.on("test end", test => {
      
    });

    // test results
    runner.on("pass", test => {
      state.passes++;
    });
    runner.on("fail", (test, error) => {
      state.fails++;
      console.error(`  + ${error.message}`);
      errors.push([test, error]);
    });
    
    // it.skip()/test.skip():
    runner.on("pending", test => {
      state.pendings++;
      console.warn(`- (pending) ${test.title}`);
    });
    // with retry count?
    runner.on("retry", (test, error) => {
    });
  }
};
