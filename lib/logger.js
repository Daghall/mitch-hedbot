"use strict";

exports.debug = function (...args) {
  if (process.env.DEBUG) {
    console.log(...args); // eslint-disable-line no-console
  }
};
