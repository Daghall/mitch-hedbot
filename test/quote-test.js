"use strict";

const ck = require("chronokinesis");
const expect = require("chai").expect;
const pythia = require("the-pythia");
const quote = require("../lib/quote");
const quotes = require("../data/mitch.json");

const firstQuote = quotes[0];
const lastQuote = quotes.slice(-1).pop();

describe("quote", () => {
  context("random", () => {
    before(() => {
      pythia.predict([ 0, 0.1337, 0.9999999999 ], { repeat: false });
    });

    it("returns random quote (first)", async () => {
      const event = { queryStringParameters: {} };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: firstQuote,
      });
    });

    it("returns random quote", async () => {
      const event = { queryStringParameters: {} };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: "I got a parrot and it talked, but it did not say \"I'm hungry\", so it died.",
      });
    });

    it("returns random quote (last)", async () => {
      const event = { queryStringParameters: {} };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: lastQuote,
      });
    });
  });

  context("dates", () => {
    before(() => {
      ck.freeze("2022-09-23");
    });
    after(ck.defrost);

    it("returns the quote of the day", async () => {
      const event = { queryStringParameters: { type: "day" } };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: "I'm against picketing, but I don't know how to show it.",
      });
    });

    it("returns the quote of the week", async () => {
      const event = { queryStringParameters: { type: "week" } };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: "This shirt is 'dry-clean only' — which means it's dirty.",
      });
    });

    it("wraps 253 days after initial date", async () => {
      ck.freeze("2023-04-11");

      const event = { queryStringParameters: { type: "day" } };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: firstQuote,
      });
    });
  });

  context("extended response", () => {
    before(() => {
      ck.freeze("2022-09-23");
      pythia.predict(0.1337, { repeat: false });
    });
    after(ck.defrost);

    it("random quote", async () => {
      const event = { queryStringParameters: { extended: "true" } };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: JSON.stringify({
          quote: "I got a parrot and it talked, but it did not say \"I'm hungry\", so it died.",
          index: 33,
        }),
      });
    });

    it("quote of the day", async () => {
      const event = {
        queryStringParameters: {
          type: "day",
          extended: "true",
        },
      };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: JSON.stringify({
          quote: "I'm against picketing, but I don't know how to show it.",
          index: 53,
        }),
      });
    });

    it("returns the quote of the week", async () => {
      const event = {
        queryStringParameters: {
          type: "week",
          extended: "true",
        },
      };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: JSON.stringify({
          quote: "This shirt is 'dry-clean only' — which means it's dirty.",
          index: 7,
        }),
      });
    });
  });

  context("indexing", () => {
    it("returns quote by index", async () => {
      const event = { queryStringParameters: { index: "33" } };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: "I got a parrot and it talked, but it did not say \"I'm hungry\", so it died.",
      });
    });

    it("returns quote with negative index", async () => {
      const event = { queryStringParameters: { index: "-1" } };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: lastQuote,
      });
    });

    it("returns quote with index greater than max", async () => {
      const event = { queryStringParameters: { index: `${quotes.length}` } };

      const response = await quote.handler(event);
      expect(response).to.deep.equal({
        statusCode: 200,
        body: firstQuote,
      });
    });
  });
});
