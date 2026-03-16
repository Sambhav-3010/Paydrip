import { Consumer, Kafka, logLevel, Producer } from 'kafkajs'
import type { SalaryStreamLiveMessage } from '@/lib/stream-types'

const topic = process.env.KAFKA_TOPIC ?? 'paydrip.salary.live'
const clientId = process.env.KAFKA_CLIENT_ID ?? 'paydrip-next-backend'

let kafka: Kafka | null = null
let producerPromise: Promise<Producer> | null = null

function getKafka(): Kafka {
  if (kafka) return kafka

  const brokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092')
    .split(',')
    .map((broker) => broker.trim())
    .filter(Boolean)

  kafka = new Kafka({
    clientId,
    brokers,
    logLevel: logLevel.NOTHING,
  })

  return kafka
}

export async function getSalaryProducer(): Promise<Producer> {
  if (!producerPromise) {
    const producer = getKafka().producer()
    producerPromise = producer.connect().then(() => producer)
  }
  return producerPromise
}

export async function publishSalarySnapshot(message: SalaryStreamLiveMessage): Promise<void> {
  const producer = await getSalaryProducer()
  await producer.send({
    topic,
    messages: [
      {
        key: String(message.streamId),
        value: JSON.stringify(message),
      },
    ],
  })
}

export async function createSalaryConsumer(groupId: string): Promise<Consumer> {
  const consumer = getKafka().consumer({ groupId })
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: false })
  return consumer
}