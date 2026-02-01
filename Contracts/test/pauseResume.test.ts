import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("PayrollStreaming - Pause & Resume", function () {
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

  describe("Pause Stream", function () {
    it("Employer can pause stream", async function () {
      await increaseTime(120);

      await expect(payroll.connect(employer).pauseStream(0))
        .to.emit(payroll, "StreamPaused");

      const stream = await payroll.getStream(0);
      expect(stream[8]).to.equal(1);
    });

    it("Non employer cannot pause", async function () {
      await expect(
        payroll.connect(other).pauseStream(0)
      ).to.be.revertedWithCustomError(payroll, "UnauthorizedAccess");
    });

    it("Cannot pause already paused stream", async function () {
      await increaseTime(120);
      await payroll.connect(employer).pauseStream(0);

      await expect(
        payroll.connect(employer).pauseStream(0)
      ).to.be.revertedWithCustomError(payroll, "InvalidStreamState");
    });
  });

  describe("Resume Stream", function () {
    beforeEach(async function () {
      await increaseTime(120);
      await payroll.connect(employer).pauseStream(0);
    });

    it("Employer can resume stream", async function () {
      await expect(payroll.connect(employer).resumeStream(0))
        .to.emit(payroll, "StreamResumed");

      const stream = await payroll.getStream(0);
      expect(stream[8]).to.equal(0);
    });

    it("Non employer cannot resume", async function () {
      await expect(
        payroll.connect(other).resumeStream(0)
      ).to.be.revertedWithCustomError(payroll, "UnauthorizedAccess");
    });

    it("Cannot resume active stream", async function () {
      await payroll.connect(employer).resumeStream(0);

      await expect(
        payroll.connect(employer).resumeStream(0)
      ).to.be.revertedWithCustomError(payroll, "InvalidStreamState");
    });
  });
});
