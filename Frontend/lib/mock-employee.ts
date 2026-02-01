export interface EmployeeStream {
  id: string
  employer: string
  employerName: string
  totalAmount: number
  accrued: number
  withdrawn: number
  remaining: number
  startDate: Date
  endDate: Date
  status: 'active' | 'completed'
  ratePerSecond: number
}

export const mockEmployeeStreams: EmployeeStream[] = [
  {
    id: '0x1234...5678',
    employer: '0x70997970C51812e339D9B73b0245ad59419F4572',
    employerName: 'TechCorp Inc',
    totalAmount: 10,
    accrued: 5.2,
    withdrawn: 2.8,
    remaining: 2.4,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    ratePerSecond: 0.000000317,
  },
  {
    id: '0xabcd...ef01',
    employer: '0x3C44CdDdB6a900c6639c60Fd69f6ad7b1470DA6e',
    employerName: 'StartupXYZ',
    totalAmount: 8,
    accrued: 3.2,
    withdrawn: 1.5,
    remaining: 1.7,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2025-02-28'),
    status: 'active',
    ratePerSecond: 0.000000254,
  },
]
