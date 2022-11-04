"use strict";

const ck = require("chronokinesis");
const expect = require("chai").expect;
const quote = require("../lib/quote");

const mathRandom = Math.random;

describe("quote", () => {
  before(() => {
    ck.freeze("2022-09-23");
  });

  after(ck.defrost);

  it("returns random quote", async () => {
    mockRandom();

    const event = { queryStringParameters: {} };

    const response = await quote.handler(event);
    expect(response).to.deep.equal({
      statusCode: 200,
      body: "People tell me how hard it is to stop smoking; I think it’s about as hard as it is to start flossing.",
    });

    restoreRandom();
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

function mockRandom() {
  Math.random = () => 0.1337;
}

function restoreRandom() {
  Math.random = mathRandom;
}
