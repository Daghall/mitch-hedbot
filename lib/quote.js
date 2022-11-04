"use strict";

const mitchQuotes = require("../data/mitch.json");
const { debug } = require("./logger");
const { fireWebHook } = require("./fire-web-hook");

const startDate = new Date("2022-08-01T00:00:00+02:00").getTime();
const NUMBER_OF_QUOTES = mitchQuotes.length;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_IN_MS = 7 * ONE_DAY_IN_MS;

exports.handler = function (event) {
  debug("Quoting...");
  const { type, push } = event.queryStringParameters ?? {};
  const quote = newFunction(type);
  debug(`Quote: ${quote}. Type: ${type}. Push: ${push}`);

  if (push) {
    return fireWebHook(quote);
  } else {
    // AWS Lambda handlers must be asynchronous
    return Promise.resolve({
      statusCode: 200,
      body: quote,
    });
  }
};

function newFunction(type, index) {
  switch (type) {
    case "week":
      index = getWeekNumber();
      break;

    case "day":
      index = getDayNumber();
      break;

    default:
      index = random();
  }
  return mitchQuotes[index];
}

function random() {
  return Math.floor(Math.random() * NUMBER_OF_QUOTES);
}

function getWeekNumber() {
  return timeFromNow(ONE_WEEK_IN_MS);
}

function getDayNumber() {
  return timeFromNow(ONE_DAY_IN_MS);
}

function timeFromNow(offset) {
  const now = new Date().setUTCHours(0, 0, 0, 0);
  const timeFromStartDate = Math.floor((now - startDate) / offset);
  return timeFromStartDate % NUMBER_OF_QUOTES;
}