"use strict";

const fs = require("fs");
const logFile = "test.log";

// Keep a reference to the original Date,
// since Chronokinesis overwrites it:
const RealDate = Date;

exports.debug = getLogger();

function getLogger() {
  if (process.env.DEBUG) {
    return console.log; // eslint-disable-line no-console
  } else {
    return logToFile;
  }
}

function logToFile(...args) {
  const time = new RealDate().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });
  const message = args.join("");
  const logString = `[${time}] ${message}\n`;
  fs.appendFileSync(logFile, logString);
}
