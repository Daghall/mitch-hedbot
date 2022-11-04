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
  });

  after(ck.defrost);
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
        push: "true",
      },
    });

    expect(webHook.isDone()).to.equal(true);
  });
});
