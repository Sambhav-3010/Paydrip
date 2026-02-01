import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Counter", function () {
  it("Say hello world", async function () {
    console.log("Hello, World!");
    expect(true).to.be.true;
  });
});
