import {run} from "../../runner.js";

run([
  [new URL("./site1/", import.meta.url), 9000],
  [new URL("./site2/", import.meta.url), 9100],
], {
  //browser: "firefox",
  //browser: "webkit",
  browser: "all",
  launch: {
    //headless: false, appMode: true, devtools: true,
    //args: ["--disable-web-security"],
  },
  goto: {
    waitUntil: "networkidle0",
    //timeout: 300 * 1000,
  },
  //timeout: 300 * 1000,  
}).catch(console.error);
