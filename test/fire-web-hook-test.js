"use strict";

const { expect } = require("chai");
const nock = require("nock");
const ck = require("chronokinesis");
nock.disableNetConnect();

const { handler: quote } = require("../lib/quote");

describe("fire web hook", () => {
  before(() => {
    ck.freeze("2022-09-23");
    process.env.WEB_HOOK = "https://slack.url/hook/id";
    process.env.WEB_HOOK_DEV = "https://slack.url/hook/dev";
    process.env.AUTH_TOKEN = "valid-token";
  });
  after(ck.defrost);
  afterEach(nock.cleanAll);

  it("sends request to web hook", async () => {
    const webHook = nock("https://slack.url", {
      reqheaders: {

        "content-type": "application/json",
        "content-length": 75,
      },
    })
      .post("/hook/id", (body) => {
        expect(body.text).to.equal("This shirt is ‘dry-clean only’ — which means it’s dirty.");
        return true;
      })
      .reply(200);

    await quote({
      queryStringParameters: {
        type: "week",
        push: "valid-token",
      },
    });

    expect(webHook.isDone()).to.equal(true);
  });

  it("sends request to development web hook", async () => {
    const webHook = nock("https://slack.url", {
      reqheaders: {

        "content-type": "application/json",
        "content-length": 75,
      },
    })
      .post("/hook/dev", (body) => {
        expect(body.text).to.equal("This shirt is ‘dry-clean only’ — which means it’s dirty.");
        return true;
      })
      .reply(200);

    await quote({
      queryStringParameters: {
        type: "week",
        push: "valid-token",
        dev: "true",
      },
    });

    expect(webHook.isDone()).to.equal(true);
  });

  it("does not send request to web hook if invalid authentication token", async () => {
    const webHook = nock("https://slack.url", {
      reqheaders: {

        "content-type": "application/json",
        "content-length": 75,
      },
    })
      .post("/hook/id")
      .reply(200);

    const response = await quote({
      queryStringParameters: {
        type: "week",
        push: "invalid-token",
      },
    });

    expect(webHook.isDone()).to.equal(false);
    expect(response).to.deep.equal({ statusCode: 401 });
  });
});
