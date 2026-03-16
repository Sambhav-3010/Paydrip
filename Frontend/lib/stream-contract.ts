import { Contract, formatEther, parseEther } from "ethers";
import type { ChainStream, StreamStatus, StreamTransaction } from "@/lib/stream-types";

const STREAM_STATUS = {
  ACTIVE: 0,
  PAUSED: 1,
  TERMINATED: 2,
} as const;

const SECONDS_PER_DAY = 24 * 60 * 60;

function getReadableContractAddress(contract: Contract): string {
  return String(contract.target ?? "");
}

async function assertContractDeployed(contract: Contract): Promise<void> {
  const runner = contract.runner as { provider?: { getCode: (address: string) => Promise<string>; getNetwork: () => Promise<{ chainId: bigint }> } } | null;
  const provider = runner?.provider;

  if (!provider) {
    throw new Error("Wallet provider not ready. Please reconnect your wallet.");
  }

  const address = getReadableContractAddress(contract);
  const [code, network] = await Promise.all([provider.getCode(address), provider.getNetwork()]);
  const chainId = Number(network.chainId);
  if (code === "0x") {
    const networkHint = chainId === 11155111 ? "Sepolia" : chainId === 1 ? "Mainnet" : `chain ID ${chainId}`;
    throw new Error(
      chainId !== 11155111
        ? `Wrong network: you are connected to ${networkHint} (chain ID ${chainId}). Please switch MetaMask to Sepolia Testnet (chain ID 11155111).`
        : `No contract is deployed at ${address} on Sepolia. The contract may have been redeployed — check NEXT_PUBLIC_CONTRACT_ADDRESS.`
    );
  }
}

function toUserFacingContractError(error: unknown): Error {
  if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "BAD_DATA") {
    return new Error(
      "Contract call failed to decode data. The connected address/network likely does not match the deployed PayrollStreaming contract.",
    );
  }
  return error instanceof Error ? error : new Error("Contract interaction failed.");
}

function toNumber(value: bigint | number): number {
  return typeof value === "bigint" ? Number(value) : value;
}

function mapStatus(
  rawStatus: number,
  now: number,
  endTime: number,
  totalWithdrawnWei: bigint,
  totalAmountWei: bigint,
): StreamStatus {
  if (rawStatus === STREAM_STATUS.TERMINATED) {
    return "terminated";
  }
  if (rawStatus === STREAM_STATUS.PAUSED) {
    return "paused";
  }
  if (now >= endTime && totalWithdrawnWei >= totalAmountWei) {
    return "completed";
  }
  return "active";
}

function toChainStream(streamId: number, rawStream: readonly unknown[], accruedWei: bigint): ChainStream {
  const now = Math.floor(Date.now() / 1000);
  const totalAmountWei = rawStream[2] as bigint;
  const totalWithdrawnWei = rawStream[7] as bigint;
  const startTime = toNumber(rawStream[4] as bigint);
  const endTime = toNumber(rawStream[5] as bigint);
  const status = mapStatus(toNumber(rawStream[8] as bigint), now, endTime, totalWithdrawnWei, totalAmountWei);

  const withdrawableWei = accruedWei;

  return {
    id: streamId,
    employer: rawStream[0] as string,
    employee: rawStream[1] as string,
    totalAmountWei,
    totalAmountEth: Number(formatEther(totalAmountWei)),
    ratePerSecondWei: rawStream[3] as bigint,
    startTime,
    endTime,
    lastWithdrawalTime: toNumber(rawStream[6] as bigint),
    totalWithdrawnWei,
    totalWithdrawnEth: Number(formatEther(totalWithdrawnWei)),
    accruedWei,
    accruedEth: Number(formatEther(accruedWei)),
    withdrawableWei,
    withdrawableEth: Number(formatEther(withdrawableWei)),
    status,
  };
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getDurationDays(startTime: number, endTime: number): number {
  const seconds = Math.max(0, endTime - startTime);
  return Math.ceil(seconds / SECONDS_PER_DAY);
}

export function getDaysRemaining(endTime: number): number {
  const now = Math.floor(Date.now() / 1000);
  const seconds = Math.max(0, endTime - now);
  return Math.ceil(seconds / SECONDS_PER_DAY);
}

export async function fetchStream(contract: Contract, streamId: number): Promise<ChainStream> {
  await assertContractDeployed(contract);
  try {
    const [rawStream, accruedWei] = await Promise.all([
      contract.getStream(streamId),
      contract.getAccruedSalary(streamId),
    ]);

    return toChainStream(streamId, rawStream, accruedWei as bigint);
  } catch (error) {
    throw toUserFacingContractError(error);
  }
}

export async function fetchEmployerStreams(contract: Contract, employer: string): Promise<ChainStream[]> {
  await assertContractDeployed(contract);
  try {
    const streamIds = (await contract.getEmployerStreams(employer)) as bigint[];
    const streams = await Promise.all(streamIds.map((id) => fetchStream(contract, Number(id))));
    return streams.sort((a, b) => b.id - a.id);
  } catch (error) {
    throw toUserFacingContractError(error);
  }
}

export async function fetchEmployeeStreams(contract: Contract, employee: string): Promise<ChainStream[]> {
  await assertContractDeployed(contract);
  try {
    const streamIds = (await contract.getEmployeeStreams(employee)) as bigint[];
    const streams = await Promise.all(streamIds.map((id) => fetchStream(contract, Number(id))));
    return streams.sort((a, b) => b.id - a.id);
  } catch (error) {
    throw toUserFacingContractError(error);
  }
}

export async function createStream(
  contract: Contract,
  employee: string,
  totalAmountEth: string,
  durationDays: number,
): Promise<void> {
  await assertContractDeployed(contract);
  const startTime = Math.floor(Date.now() / 1000) + 120;
  const endTime = startTime + durationDays * SECONDS_PER_DAY;
  const totalAmountWei = parseEther(totalAmountEth);

  const tx = await contract.createStream(employee, totalAmountWei, startTime, endTime, {
    value: totalAmountWei,
  });
  await tx.wait();
}

export async function pauseStream(contract: Contract, streamId: number): Promise<void> {
  await assertContractDeployed(contract);
  const tx = await contract.pauseStream(streamId);
  await tx.wait();
}

export async function resumeStream(contract: Contract, streamId: number): Promise<void> {
  await assertContractDeployed(contract);
  const tx = await contract.resumeStream(streamId);
  await tx.wait();
}

export async function terminateStream(contract: Contract, streamId: number): Promise<void> {
  await assertContractDeployed(contract);
  const tx = await contract.terminateStream(streamId);
  await tx.wait();
}

export async function withdrawSalary(contract: Contract, streamId: number): Promise<void> {
  await assertContractDeployed(contract);
  const tx = await contract.withdrawSalary(streamId);
  await tx.wait();
}

export async function fetchStreamTransactions(contract: Contract, streamId: number): Promise<StreamTransaction[]> {
  try {
    const eventSpecs: Array<{ name: StreamTransaction["type"]; filter: unknown }> = [
      { name: "create", filter: contract.filters.StreamCreated(streamId) },
      { name: "withdrawal", filter: contract.filters.SalaryWithdrawn(streamId) },
      { name: "pause", filter: contract.filters.StreamPaused(streamId) },
      { name: "resume", filter: contract.filters.StreamResumed(streamId) },
      { name: "terminate", filter: contract.filters.StreamTerminated(streamId) },
    ];

    const logs = await Promise.all(
      eventSpecs.map(async ({ name, filter }) => {
        const events = await contract.queryFilter(filter as never, 0, "latest");
        return events.map((event) => {
          const amount = "args" in event && event.args?.amount ? Number(formatEther(event.args.amount as bigint)) : undefined;
          return {
            hash: event.transactionHash,
            type: name,
            amount,
            date: new Date(),
            status: "confirmed" as const,
          };
        });
      }),
    );

    return logs
      .flat()
      .sort((a, b) => b.hash.localeCompare(a.hash))
      .slice(0, 20);
  } catch {
    return [];
  }
}
