export type StreamStatus = "active" | "paused" | "completed" | "terminated";

export interface ChainStream {
  id: number;
  employer: string;
  employee: string;
  totalAmountWei: bigint;
  totalAmountEth: number;
  ratePerSecondWei: bigint;
  startTime: number;
  endTime: number;
  lastWithdrawalTime: number;
  totalWithdrawnWei: bigint;
  totalWithdrawnEth: number;
  accruedWei: bigint;
  accruedEth: number;
  withdrawableWei: bigint;
  withdrawableEth: number;
  status: StreamStatus;
}

export interface StreamTransaction {
  hash: string;
  type: "withdrawal" | "pause" | "resume" | "terminate" | "create";
  amount?: number;
  date: Date;
  status: "confirmed" | "pending";
}

