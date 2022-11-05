"use strict";

const https = require("https");
const { debug } = require("./logger");
const UnauthorizedError = require("./unauthorized-error");

module.exports = function fireWebHook(quote, authToken, dev) {
  const { WEB_HOOK, WEB_HOOK_DEV, AUTH_TOKEN } = process.env;
  const webHook = dev ? WEB_HOOK_DEV : WEB_HOOK;
  debug(`Firing web hook: ${webHook}`);

  if (authToken !== AUTH_TOKEN) {
    const message = "Unauthorized attempt to fire web hook";
    debug(message);
    throw new UnauthorizedError(message);
  }

  const postData = JSON.stringify({ text: quote });
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "content-length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(webHook, options);
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
