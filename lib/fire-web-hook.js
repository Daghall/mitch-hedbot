"use strict";

const { debug } = require("./logger");
const https = require("https");

exports.fireWebHook = function (quote) {
  const { WEB_HOOK } = process.env;
  debug(`Firing web hook: ${WEB_HOOK}`);
  const postData = JSON.stringify({ text: quote });
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "content-length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(WEB_HOOK, options);
    request.write(postData);
    request.on("response", () => {
      debug("Web hook finished");
      resolve();
    });
    request.on("error", (error) => {
      debug(`Error: ${JSON.stringify(error)}`);
      reject();
    });
    request.end();
  });
};
