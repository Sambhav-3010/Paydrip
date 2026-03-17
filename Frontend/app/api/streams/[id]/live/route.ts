import { randomUUID } from 'crypto'
import { NextRequest } from 'next/server'
import { createSalaryConsumer, publishSalarySnapshot } from '@/lib/server/kafka'
import { fetchLiveStreamSnapshot } from '@/lib/server/stream-contract'
import { signLiveMessage } from '@/lib/server/stream-signature'
import type { SalaryStreamLiveMessage } from '@/lib/stream-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function formatSseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const streamId = Number(id)

  if (!Number.isFinite(streamId) || streamId < 0) {
    return new Response(JSON.stringify({ error: 'Invalid stream id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const encoder = new TextEncoder()
  let cleanup = async () => {}

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false

      const send = (event: string, data: unknown) => {
        if (closed) return
        controller.enqueue(encoder.encode(formatSseEvent(event, data)))
      }

      const close = async () => {
        if (closed) return
        closed = true
        await cleanup()
        try {
          controller.close()
        } catch {
          return
        }
      }

      request.signal.addEventListener('abort', () => {
        void close()
      })

      const groupId = `paydrip-live-${streamId}-${randomUUID()}`

      const buildSignedSnapshot = async (): Promise<SalaryStreamLiveMessage> => {
        const snapshot = await fetchLiveStreamSnapshot(streamId)
        const unsignedMessage = {
          ...snapshot,
          producedAt: new Date().toISOString(),
        }
        return {
          ...unsignedMessage,
          signature: signLiveMessage(unsignedMessage),
        }
      }

      const startFallbackMode = async (reason: string) => {
        send('status', { state: 'connected', streamId, mode: 'fallback' })

        const publishFallbackSnapshot = async () => {
          const snapshot = await buildSignedSnapshot()
          send('salary', snapshot)
        }

        await publishFallbackSnapshot().catch((error) => {
          send('live-error', {
            message: error instanceof Error
              ? error.message
              : 'Failed to fetch fallback salary snapshot',
          })
        })

        const fallbackTimer = setInterval(() => {
          void publishFallbackSnapshot().catch((error) => {
            send('live-error', {
              message: error instanceof Error ? error.message : 'Failed to fetch fallback salary snapshot',
            })
          })
        }, 5000)

        const pingTimer = setInterval(() => {
          send('ping', { at: new Date().toISOString(), mode: 'fallback' })
        }, 15000)

        cleanup = async () => {
          clearInterval(fallbackTimer)
          clearInterval(pingTimer)
        }

        send('live-error', { message: reason })
      }

      try {
        const consumer = await createSalaryConsumer(groupId)

        const publishCurrentSnapshot = async () => {
          const signedMessage = await buildSignedSnapshot()
          await publishSalarySnapshot(signedMessage)
        }

        await publishCurrentSnapshot()

        const publishTimer = setInterval(() => {
          void publishCurrentSnapshot().catch((error) => {
            send('live-error', {
              message: error instanceof Error ? error.message : 'Failed to publish salary snapshot',
            })
          })
        }, 5000)

        const pingTimer = setInterval(() => {
          send('ping', { at: new Date().toISOString() })
        }, 15000)

        cleanup = async () => {
          clearInterval(publishTimer)
          clearInterval(pingTimer)
          await consumer.disconnect().catch(() => undefined)
        }

        send('status', { state: 'connected', streamId, mode: 'kafka' })

        void consumer.run({
          eachMessage: async ({ message }) => {
            if (!message.value) return
            const payloadText = message.value.toString()

            try {
              const payload = JSON.parse(payloadText) as SalaryStreamLiveMessage
              if (payload.streamId !== streamId) return
              send('salary', payload)
            } catch {
              return
            }
          },
        })
      } catch (error) {
        const reason = error instanceof Error
          ? `Kafka unavailable, switched to direct chain feed: ${error.message}`
          : 'Kafka unavailable, switched to direct chain feed'
        await startFallbackMode(reason)
      }
    },
    async cancel() {
      await cleanup()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}