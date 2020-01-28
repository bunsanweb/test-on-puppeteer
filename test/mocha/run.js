import {run} from "../../runner.js";

run([
  [import.meta.url, 9000],
], {
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
