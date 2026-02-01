import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("PayrollStreaming - Withdraw Salary", function () {
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

  describe("Valid Withdrawals", function () {
    it("Employee withdraws accrued salary", async function () {
      await increaseTime(200);

      const balanceBefore = await ethers.provider.getBalance(employee.address);

      const tx = await payroll.connect(employee).withdrawSalary(0);
      await tx.wait();

      const balanceAfter = await ethers.provider.getBalance(employee.address);

      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Emits SalaryWithdrawn event", async function () {
      await increaseTime(200);

      await expect(payroll.connect(employee).withdrawSalary(0))
        .to.emit(payroll, "SalaryWithdrawn");
    });
  });

  describe("Invalid Withdrawals", function () {
    it("Cannot withdraw with zero accrual", async function () {
      await expect(
        payroll.connect(employee).withdrawSalary(0)
      ).to.be.revertedWithCustomError(payroll, "InvalidStreamState");
    });

    it("Non employee cannot withdraw", async function () {
      await increaseTime(200);

      await expect(
        payroll.connect(other).withdrawSalary(0)
      ).to.be.revertedWithCustomError(payroll, "UnauthorizedAccess");
    });
  });

  describe("Multiple Withdrawals", function () {
    it("Handles multiple withdrawals correctly", async function () {
      await increaseTime(200);
      await payroll.connect(employee).withdrawSalary(0);

      await increaseTime(200);
      await payroll.connect(employee).withdrawSalary(0);

      const stream = await payroll.getStream(0);
      expect(stream[7]).to.be.gt(0);
    });
  });
});
