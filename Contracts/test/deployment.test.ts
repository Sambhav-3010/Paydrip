import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("payrollstreaming should be deployed", function () {
  let owner;
  let user1;
  let user2;
  let payroll;

  it("Should deploy successfully", async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const PayrollFactory = await ethers.getContractFactory("PayrollStreaming");
    payroll = await PayrollFactory.deploy();
    await payroll.waitForDeployment();

    expect(payroll.target).to.not.equal(ethers.ZeroAddress);
  });
});
