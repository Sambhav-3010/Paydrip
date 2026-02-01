import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const Factory = await ethers.getContractFactory("PayrollStreaming");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  console.log("Deployed to:", contract.target);
}

main();