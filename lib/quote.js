"use strict";

const mitchQuotes = require("../data/mitch.json");
const { debug } = require("./logger");
const fireWebHook = require("./fire-web-hook");
const UnauthorizedError = require("./unauthorized-error");

const startDate = new Date("2022-08-01T00:00:00+02:00").getTime();
const NUMBER_OF_QUOTES = mitchQuotes.length;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_IN_MS = 7 * ONE_DAY_IN_MS;

exports.handler = async function (event) {
  debug("Quoting...");
  const { type, push, dev, extended } = event.queryStringParameters ?? {};
  const quote = getQuote(type, extended);
  debug(`Type: ${type}. Push: ${typeof push === "string"}. Dev: ${typeof dev === "string"}. Quote: "${quote}"`);

  if (push) {
    try {
      await fireWebHook(quote, push, dev);
      return { statusCode: 200 };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return { statusCode: 401 };
      }
      return { statusCode: 500 };
    }
  } else {
    return {
      statusCode: 200,
      body: quote,
    };
  }
};

function getQuote(type, extended) {
  let index;
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

  if (extended === "true") {
    return JSON.stringify({
      quote: mitchQuotes[index],
      index,
    });
  }

  return mitchQuotes[index];
}

function random() {
  const index = Math.floor(Math.random() * NUMBER_OF_QUOTES);
  debug(`Random index: ${index}`);
  return index;
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
