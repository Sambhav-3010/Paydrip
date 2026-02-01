export interface Stream {
  id: string
  recipient: string
  recipientName: string
  amount: number
  startDate: Date
  endDate: Date
  status: 'active' | 'paused' | 'completed' | 'terminated'
  accrued: number
  withdrawn: number
  remaining: number
}

export const mockStreams: Stream[] = [
  {
    id: '0x1234...5678',
    recipient: '0x742d35Cc6634C0532925a3b844Bc927e73f5E0bb',
    recipientName: 'Alice Johnson',
    amount: 10,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    accrued: 5.2,
    withdrawn: 2.8,
    remaining: 2.4,
  },
  {
    id: '0xabcd...ef01',
    recipient: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    recipientName: 'Bob Smith',
    amount: 15,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2025-02-14'),
    status: 'active',
    accrued: 3.75,
    withdrawn: 1.5,
    remaining: 2.25,
  },
  {
    id: '0x2468...1357',
    recipient: '0x27a69aB83a3b7528a3ce3dA3b6Ae2D6E4F1E8B2C',
    recipientName: 'Carol White',
    amount: 12,
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-11-30'),
    status: 'completed',
    accrued: 12,
    withdrawn: 12,
    remaining: 0,
  },
]
