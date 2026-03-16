import { createHmac } from 'crypto'
import type { SalaryStreamLiveMessage } from '@/lib/stream-types'

type UnsignedLiveMessage = Omit<SalaryStreamLiveMessage, 'signature'>

export function signLiveMessage(payload: UnsignedLiveMessage): string {
  const secret = process.env.KAFKA_SIGNATURE_SECRET ?? 'paydrip-local-signature'
  const canonical = JSON.stringify(payload)
  return createHmac('sha256', secret).update(canonical).digest('hex')
}