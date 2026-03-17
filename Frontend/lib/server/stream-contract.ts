import { Contract, JsonRpcProvider, formatEther } from 'ethers'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract'
import type { SalaryStreamLiveMessage, StreamStatus } from '@/lib/stream-types'

const STREAM_STATUS = {
  ACTIVE: 0,
  PAUSED: 1,
  TERMINATED: 2,
} as const

let provider: JsonRpcProvider | null = null
let contract: Contract | null = null

function getProvider(): JsonRpcProvider {
  if (provider) return provider

  const rpcUrl = process.env.NEXT_PUBLIC_SEPOPLIA_RPC_URL ?? process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
  if (!rpcUrl) {
    throw new Error('RPC URL is not configured. Set NEXT_PUBLIC_SEPOLIA_RPC_URL (or NEXT_PUBLIC_SEPOPLIA_RPC_URL).')
  }

  provider = new JsonRpcProvider(rpcUrl)
  return provider
}

function getContract(): Contract {
  if (contract) return contract

  contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, getProvider())
  return contract
}

function toNumber(value: bigint | number): number {
  return typeof value === 'bigint' ? Number(value) : value
}

function mapStatus(
  rawStatus: number,
  now: number,
  endTime: number,
  totalWithdrawnWei: bigint,
  totalAmountWei: bigint,
): StreamStatus {
  if (rawStatus === STREAM_STATUS.TERMINATED) {
    return 'terminated'
  }
  if (rawStatus === STREAM_STATUS.PAUSED) {
    return 'paused'
  }
  if (now >= endTime && totalWithdrawnWei >= totalAmountWei) {
    return 'completed'
  }
  return 'active'
}

export async function fetchLiveStreamSnapshot(
  streamId: number,
): Promise<Omit<SalaryStreamLiveMessage, 'producedAt' | 'signature'>> {
  const contractInstance = getContract()
  const now = Math.floor(Date.now() / 1000)
  const [rawStream, accruedWei] = await Promise.all([
    contractInstance.getStream(streamId),
    contractInstance.getAccruedSalary(streamId),
  ])

  const totalAmountWei = rawStream[2] as bigint
  const totalWithdrawnWei = rawStream[7] as bigint
  const endTime = toNumber(rawStream[5] as bigint)

  return {
    streamId,
    employer: rawStream[0] as string,
    employee: rawStream[1] as string,
    totalAmountEth: Number(formatEther(totalAmountWei)),
    accruedEth: Number(formatEther(accruedWei as bigint)),
    withdrawableEth: Number(formatEther(accruedWei as bigint)),
    totalWithdrawnEth: Number(formatEther(totalWithdrawnWei)),
    startTime: toNumber(rawStream[4] as bigint),
    endTime,
    status: mapStatus(toNumber(rawStream[8] as bigint), now, endTime, totalWithdrawnWei, totalAmountWei),
  }
}