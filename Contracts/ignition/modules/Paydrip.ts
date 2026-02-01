import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PaydripModule", (m) => {
  const paydrip = m.contract("Paydrip");

  return { paydrip };
});
