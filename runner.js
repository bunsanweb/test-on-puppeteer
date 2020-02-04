import path from "path";
import nodeUrl from "url";
import util from "util";
import process from "process";

import colors from "colors";
import LocalWebServer from "local-web-server";
import playwright from "playwright";

export const run = async (urlPorts, opts = {}) => {
  let fails = 0;
  if (opts.browser === "all") {
    fails += await runOnBrowser("chromium", urlPorts, opts);
    fails += await runOnBrowser("webkit", urlPorts, opts);
    fails += await runOnBrowser("firefox", urlPorts, opts);
  } else {
    fails += await runOnBrowser(opts.browser || "chromium", urlPorts, opts);
  }
  if (fails && opts.errorExit !== false) process.exit(1);
  return fails;
};
export const runOnBrowser = async (type, urlPorts, opts = {}) => {
  console.info(colors.bgWhite(colors.black(`[Run on ${type}]`)));
  const initUrl = `http://localhost:${urlPorts[0][1]}/`;
  const wss = urlPorts.map(([url, port]) => runLWS(url, port));
  const browser = await playwright[type].launch(opts.launch);
  const guard = newGuard();
  const fails = {asserts: 0};
  const queue = newQueue();
  try {
    const page = await browser.defaultContext().newPage();
    await page.exposeFunction("finish", guard.finish);
    page.on("error", err => console.error(err));
    page.on("pageerror", err => console.error(err));
    page.on("console", msg => {
      if (msg.type() === "assert") fails.asserts++;
      //consoleOut(msg).catch(error => 0);
      queue.push(msg);
    });

    const consoleWorker = (async () => {
      for await (const msg of queue) await consoleOut(msg);
    })();
    
    const pagePromise = page.goto(initUrl, opts.goto);
    if (opts.timeout > 0) {
      const id = setTimeout(
        guard.error, opts.timeout, `timeout: ${opts.timeout}ms`);
      try {
        await guard.promise;
      } finally {
        clearTimeout(id);
      }
    } else {
      guard.finish();
    }
    await pagePromise;
    
    if (opts.launch && opts.launch.headless === false) {
      const pageGuard = newGuard();
      page.on("close", () => {
        queue.close();
        pageGuard.finish();
      });
      await consoleWorker;
      await pageGuard.promise;
    } else {
      queue.close();
      await consoleWorker;
      await page.close();
    }
  } finally {
    await browser.close();
    wss.forEach(ws => ws.server.close());
  }
  
  if (fails.asserts) {
    console.error(colors.red(`FAIL`), `${fails.asserts} AssertionError`);
  } else {
    console.error(colors.green(`OK`), `Passed`);
  }
  return fails.asserts;
};

export const runLWS = (url, port) => {
  const file = nodeUrl.fileURLToPath(url);
  const directory = file.endsWith(path.sep) ? file : path.dirname(file);
  return LocalWebServer.create({port, directory});
};

export const consoleOut = async msg => {
  const {url, lineNumber, columnNumber} = msg.location();
  const fmt = `[${url} ${lineNumber}:${columnNumber}]:`;
  const args = await Promise.all(msg.args().map(arg => arg.jsonValue()));
  const text = util.format(...args);
  switch (msg.type()) {
  case "assert":
    console.error(colors.red(fmt), "Assertion Failed:", text);
    break;
  case "error":
    console.warn(colors.magenta(fmt), text);
    break;
  case "warning":
    console.warn(colors.yellow(fmt), text);
    break;
  case "debug":
    console.debug(colors.blue(fmt), text);
    break;
  case "info":
    console.info(colors.green(fmt), text);
    break;
  default:
    console.log(fmt, text);
    break;
  }
};

function newQueue() {
  const [gets, polls] = [[], []];
  const next = () => new Promise(
    get => polls.length > 0 ? polls.shift()(get) : gets.push(get));
  const poll = () => new Promise(
    poll => gets.length > 0 ? poll(gets.shift()) : polls.push(poll));
  const push = value => poll().then(get => get({value, done: false}));
  const close = () => poll().then(get => get({done: true}));
  return {[Symbol.asyncIterator]() {return this;}, next, push, close};
}

const newGuard = () => {
  let r = {};
  r.promise = new Promise((finish, error) => {
    r.finish = finish;
    r.error = error;
  });
  return r;
};
