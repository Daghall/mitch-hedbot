"use strict";

const ck = require("chronokinesis");
const expect = require("chai").expect;
const pythia = require("the-pythia");
const quote = require("../lib/quote");
const quotes = require("../data/mitch.json");

describe("quote", () => {
  before(() => {
    ck.freeze("2022-09-23");
    pythia.predict([ 0, 0.1337, 0.9999999999, 0.1337 ], { repeat: false });
  });

  after(ck.defrost);

  it("returns random quote (top)", async () => {
    const event = { queryStringParameters: {} };

    const response = await quote.handler(event);
    expect(response).to.deep.equal({
      statusCode: 200,
      body: quotes[0],
    });
  });

  it("returns random quote", async () => {
    const event = { queryStringParameters: {} };

    const response = await quote.handler(event);
    expect(response).to.deep.equal({
      statusCode: 200,
      body: "People tell me how hard it is to stop smoking; I think it’s about as hard as it is to start flossing.",
    });
  });

  it("returns random quote (bottom)", async () => {
    const event = { queryStringParameters: {} };

    const response = await quote.handler(event);
    expect(response).to.deep.equal({
      statusCode: 200,
      body: quotes.slice(-1).pop(),
    });
  });

  it("returns random quote, extended", async () => {
    const event = { queryStringParameters: { extended: "true" } };

    const response = await quote.handler(event);
    expect(response).to.deep.equal({
      statusCode: 200,
      body: JSON.stringify({
        quote: "People tell me how hard it is to stop smoking; I think it’s about as hard as it is to start flossing.",
        index: 18,
      }),
    });
  });

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
      body: "This shirt is ‘dry-clean only’ — which means it’s dirty.",
    });
  });

  it("wraps 141 days after initial date", async () => {
    ck.freeze("2022-12-20");

    const event = { queryStringParameters: { type: "day" } };

    const response = await quote.handler(event);
    expect(response).to.deep.equal({
      statusCode: 200,
      body: "My fake plants died because I did not pretend to water them.",
    });
  });
});
