import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("PayrollStreaming - View Functions", function () {
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

  describe("getAccruedSalary", function () {
    it("Returns correct accrued salary after time passes", async function () {
      await increaseTime(200);

      const accrued = await payroll.getAccruedSalary(0);
      expect(accrued).to.be.gt(0);
    });

    it("Returns zero before start time", async function () {
      const accrued = await payroll.getAccruedSalary(0);
      expect(accrued).to.equal(0);
    });
  });

  describe("Stream Lookups", function () {
    it("Returns employee streams", async function () {
      const streams = await payroll.getEmployeeStreams(employee.address);
      expect(streams.length).to.equal(1);
    });

    it("Returns employer streams", async function () {
      const streams = await payroll.getEmployerStreams(employer.address);
      expect(streams.length).to.equal(1);
    });
  });

  describe("getStream Struct", function () {
    it("Returns full stream data correctly", async function () {
      const stream = await payroll.getStream(0);

      expect(stream[0]).to.equal(employer.address);
      expect(stream[1]).to.equal(employee.address);
      expect(stream[2]).to.be.gt(0);
      expect(stream[8]).to.equal(0);
    });
  });
});
