import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-verify";

const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
const sepoliaPrivateKey = process.env.SEPOLIA_PRIVATE_KEY;
const hasSepoliaConfig =
  !!sepoliaRpcUrl &&
  !!sepoliaPrivateKey &&
  !sepoliaPrivateKey.includes("<PRIVATE_KEY>");

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.33",
      },
      production: {
        version: "0.8.33",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    ...(hasSepoliaConfig
      ? {
          sepolia: {
            type: "http" as const,
            chainType: "l1" as const,
            url: sepoliaRpcUrl,
            accounts: [sepoliaPrivateKey],
          },
        }
      : {}),
  },
});
