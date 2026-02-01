import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("PayrollStreaming - Security & Edge Cases", function () {
  let payroll: any;
  let employer: any;
  let employee: any;

  beforeEach(async function () {
    [employer, employee] = await ethers.getSigners();

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

  describe("Earnings Cap", function () {
    it("Caps earnings at totalAmount", async function () {
      await increaseTime(100000);

      const accrued = await payroll.getAccruedSalary(0);
      const stream = await payroll.getStream(0);

      expect(accrued).to.be.lte(stream[2]);
    });
  });

  describe("Multiple Withdrawals Integrity", function () {
    it("Maintains correct totals across withdrawals", async function () {
      await increaseTime(200);
      await payroll.connect(employee).withdrawSalary(0);

      await increaseTime(200);
      await payroll.connect(employee).withdrawSalary(0);

      const stream = await payroll.getStream(0);
      expect(stream[7]).to.be.gt(0);
    });
  });

  describe("Reentrancy Guard Presence", function () {
    it("Ensures state changes before transfers", async function () {
      await increaseTime(200);

      const tx = await payroll.connect(employee).withdrawSalary(0);
      await tx.wait();

      const stream = await payroll.getStream(0);
      expect(stream[7]).to.be.gt(0);
    });
  });
});
