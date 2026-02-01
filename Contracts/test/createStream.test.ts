import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("PayrollStreaming - Create Stream", function () {
  let payroll: any;
  let employer: any;
  let employee: any;
  let other: any;

  beforeEach(async function () {
    [employer, employee, other] = await ethers.getSigners();

    const PayrollFactory = await ethers.getContractFactory("PayrollStreaming");
    payroll = await PayrollFactory.deploy();
    await payroll.waitForDeployment();
  });

  async function getTimes() {
    const block = await ethers.provider.getBlock("latest");
    const start = block!.timestamp + 60;
    const end = start + 3600;
    return { start, end };
  }
  describe("Valid Creation", function () {
    it("Should create valid stream", async function () {
      const { start, end } = await getTimes();
      const totalAmount = ethers.parseEther("1");

      await expect(
        payroll
          .connect(employer)
          .createStream(employee, totalAmount, start, end, {
            value: totalAmount,
          }),
      ).to.emit(payroll, "StreamCreated");

      const stream = await payroll.getStream(0);
      expect(stream[0]).to.equal(employer.address);
      expect(stream[1]).to.equal(employee.address);
      expect(stream[2]).to.equal(totalAmount);
      expect(stream[8]).to.equal(0);
    });
  });

  describe("Invalid Employee Address", function () {
    it("Should fail with zero employee", async function () {
      const { start, end } = await getTimes();
      const totalAmount = ethers.parseEther("1");

      await expect(
        payroll
          .connect(employer)
          .createStream(ethers.ZeroAddress, totalAmount, start, end, {
            value: totalAmount,
          }),
      ).to.be.revertedWithCustomError(payroll, "InvalidAddress");
    });
  });

  describe("Invalid Timestamps", function () {
    it("Should fail if startTime is in the past", async function () {
      const block = await ethers.provider.getBlock("latest");
      const start = block!.timestamp - 100;
      const end = start + 3600;
      const totalAmount = ethers.parseEther("1");

      await expect(
        payroll
          .connect(employer)
          .createStream(employee.address, totalAmount, start, end, {
            value: totalAmount,
          }),
      ).to.be.revertedWithCustomError(payroll, "InvalidTimestamps");
    });

    it("Should fail if endTime <= startTime", async function () {
      const block = await ethers.provider.getBlock("latest");
      const start = block!.timestamp + 100;
      const end = start;
      const totalAmount = ethers.parseEther("1");

      await expect(
        payroll
          .connect(employer)
          .createStream(employee.address, totalAmount, start, end, {
            value: totalAmount,
          }),
      ).to.be.revertedWithCustomError(payroll, "InvalidTimestamps");
    });

    describe("Invalid ETH Handling", async function () {
      it("Should fail if ETH sent is less", async function () {
        const { start, end } = await getTimes();
        const totalAmount = ethers.parseEther("1");

        await expect(
          payroll
            .connect(employer)
            .createStream(employee, totalAmount, start, end, {
              value: ethers.parseEther("0.5"),
            }),
        ).to.be.revertedWithCustomError(payroll, "InsufficientBalance");
      });

      it("Should fail if totalAmount is zero", async function () {
        const { start, end } = await getTimes();

        await expect(
          payroll
            .connect(employer)
            .createStream(employee, 0, start, end, { value: 0 }),
        ).to.be.revertedWithCustomError(payroll, "InvalidStreamState");
      });
    });

    describe("Mappings & Indexing", function () {
      it("Should store ID in employerStreams", async function () {
        const { start, end } = await getTimes();
        const totalAmount = ethers.parseEther("1");

        await payroll
          .connect(employer)
          .createStream(employee.address, totalAmount, start, end, {
            value: totalAmount,
          });

          const streams = await payroll.getEmployerStreams(employer.address);
          expect(streams.length).to.equal(1);
      });


      it("Should store ID in employeeStreams", async function () {
        const { start, end } = await getTimes();
        const totalAmount = ethers.parseEther("1");

        await payroll
          .connect(employer)
          .createStream(employee.address, totalAmount, start, end, {
            value: totalAmount,
          });

          const streams = await payroll.getEmployeeStreams(employee.address);
          expect(streams.length).to.equal(1);
      });
    });
  });
});
