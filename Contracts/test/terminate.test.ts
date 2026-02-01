import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("PayrollStreaming - Termination", function () {
  let payroll: any;
  let employer: any;
  let employee: any;
  let other: any;

  beforeEach(async function () {
    [employer, employee, other] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("PayrollStreaming");
    payroll = await Factory.deploy();
    await payroll.waitForDeployment();

    const block = await ethers.provider.getBlock("latest");
    const start = block!.timestamp + 60;
    const end = start + 3600;
    const totalAmount = ethers.parseEther("1");

    await payroll
      .connect(employer)
      .createStream(employee.address, totalAmount, start, end, {
        value: totalAmount,
      });
  });

  async function increaseTime(seconds: number) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine", []);
  }

  describe("Valid Termination", function () {
    it("Employer terminates stream", async function () {
      await increaseTime(300);

      await expect(payroll.connect(employer).terminateStream(0))
        .to.emit(payroll, "StreamTerminated");

      const stream = await payroll.getStream(0);
      expect(stream[8]).to.equal(2);
    });

    it("Settles employee and refunds employer", async function () {
      await increaseTime(300);

      const empBefore = await ethers.provider.getBalance(employee.address);
      const empTx = await payroll.connect(employer).terminateStream(0);
      await empTx.wait();
      const empAfter = await ethers.provider.getBalance(employee.address);

      expect(empAfter).to.be.gt(empBefore);
    });
  });

  describe("Invalid Termination", function () {
    it("Non employer cannot terminate", async function () {
      await expect(
        payroll.connect(other).terminateStream(0)
      ).to.be.revertedWithCustomError(payroll, "UnauthorizedAccess");
    });

    it("Cannot terminate twice", async function () {
      await increaseTime(200);
      await payroll.connect(employer).terminateStream(0);

      await expect(
        payroll.connect(employer).terminateStream(0)
      ).to.be.revertedWithCustomError(payroll, "InvalidStreamState");
    });
  });
});
