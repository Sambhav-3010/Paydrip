# Paydrip

Paydrip is a decentralized salary streaming application built with a Solidity payroll contract and a Next.js frontend. Employers can create and manage salary streams, while employees can monitor accrual in real time and withdraw available salary from active streams.

The repository is split into two workspaces:

- `Frontend/`: Next.js 16 + React 19 application
- `Contracts/`: Hardhat 3 Solidity project for the payroll streaming contract

## Features

- Create on-chain salary streams funded upfront by the employer
- Pause, resume, terminate, and withdraw from streams
- Employer and employee dashboards with stream summaries
- Stream details page with contract-backed history and live salary updates
- Kafka-backed live snapshot pipeline with direct-chain fallback when Kafka is unavailable
- Sepolia wallet flow with MetaMask integration

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Ethers v6
- Hardhat 3
- Solidity 0.8.33
- KafkaJS

## Repository Structure

```text
Paydrip/
|- Frontend/
|  |- app/
|  |- components/
|  |- contexts/
|  |- hooks/
|  |- lib/
|  \- public/
|- Contracts/
|  |- contracts/
|  |- ignition/
|  |- scripts/
|  |- test/
|  \- types/
\- README.md
```

## How It Works

### Smart Contract Layer

The payroll contract lives in [Contracts/contracts/Paydrip.sol](Contracts/contracts/Paydrip.sol). It stores each stream's employer, employee, funded amount, rate per second, timing, withdrawn amount, and status.

Main contract actions:

- `createStream`: employer creates and funds a stream
- `pauseStream`: pauses a stream and releases accrued salary
- `resumeStream`: resumes a paused stream
- `terminateStream`: ends a stream and settles remaining balances
- `withdrawSalary`: employee withdraws currently accrued salary

### Frontend Layer

The frontend connects to the deployed contract using Ethers and MetaMask. It loads stream data for employers and employees, renders dashboards, and provides actions for managing or withdrawing streams.

### Live Salary Feed

The stream details page includes a live salary feed.

Current implementation:

1. The Next.js backend reads the deployed contract state through RPC.
2. It builds a signed salary snapshot for a given stream.
3. It publishes that snapshot into Kafka.
4. It consumes the same topic and forwards updates to the browser via Server-Sent Events.
5. If Kafka is unavailable, the backend falls back to a direct chain snapshot feed so the UI still updates.

Relevant files:

- [Frontend/app/api/streams/[id]/live/route.ts](Frontend/app/api/streams/[id]/live/route.ts)
- [Frontend/lib/server/kafka.ts](Frontend/lib/server/kafka.ts)
- [Frontend/lib/server/stream-contract.ts](Frontend/lib/server/stream-contract.ts)
- [Frontend/lib/server/stream-signature.ts](Frontend/lib/server/stream-signature.ts)
- [Frontend/app/stream/[id]/page.tsx](Frontend/app/stream/[id]/page.tsx)

## Architecture Diagram

The diagram below is GitHub-friendly Mermaid and can also be imported into Excalidraw using `Insert -> Mermaid`.



### Prerequisites

- Node.js 18+
- pnpm
- MetaMask
- Sepolia ETH for testing
- Kafka broker if you want Kafka mode enabled locally

### 1. Install Dependencies

Frontend:

```bash
cd Frontend
pnpm install
```

Contracts:

```bash
cd Contracts
pnpm install
```

## Environment Variables

### Frontend

Create `Frontend/.env.local` with:

```dotenv
NEXT_PUBLIC_CONTRACT_ADDRESS=0x2A0328A28d572Eda5b1D91C7c6dFAF9eA4a5de46
NEXT_PUBLIC_SEPOPLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=paydrip-next-backend
KAFKA_TOPIC=paydrip.salary.live
KAFKA_SIGNATURE_SECRET=paydrip-local-signature
NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=false
```

Notes:

- `NEXT_PUBLIC_SEPOPLIA_RPC_URL` is the RPC URL currently used by the frontend backend route for live stream snapshots.
- If Kafka is not running, the stream details page will fall back to direct-chain live updates.
- Analytics are disabled locally by default.

### Contracts

Create `Contracts/.env` with:

```dotenv
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
SEPOLIA_PRIVATE_KEY=your_private_key
```

## Running the App

### Start the Frontend

```bash
cd Frontend
pnpm dev
```

### Build the Frontend

```bash
cd Frontend
pnpm build
pnpm start
```

### Compile Contracts

```bash
cd Contracts
npx hardhat compile
```

### Run Contract Tests

```bash
cd Contracts
npx hardhat test
```

### Deploy to Sepolia

```bash
cd Contracts
npx hardhat run scripts/deploy.ts --network sepolia
```

## Docker Deployment

This repository now includes Docker support for running the frontend together with Kafka.

Files added:

- `Frontend/Dockerfile`: production image for AWS or any container host
- `Frontend/Dockerfile.dev`: containerized development image
- `Frontend/.dockerignore`: keeps Docker build context small
- `docker-compose.yml`: starts the app and Kafka together

### Docker Build

Build the frontend image from the repository root:

```bash
docker build \
	-f Frontend/Dockerfile \
	--build-arg NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address \
	--build-arg NEXT_PUBLIC_SEPOPLIA_RPC_URL=your_sepolia_rpc_url \
	--build-arg NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=false \
	-t paydrip-app:latest \
	./Frontend
```

### Docker Compose

Create or update `Frontend/.env.local` with your values, then run compose from repository root.

Required env file (`Frontend/.env.local`):

```dotenv
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_SEPOPLIA_RPC_URL=your_sepolia_rpc_url
KAFKA_CLIENT_ID=paydrip-next-backend
KAFKA_TOPIC=paydrip.salary.live
KAFKA_SIGNATURE_SECRET=paydrip-local-signature
NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=false
```

Then run:

```bash
docker compose up --build
```

The app will be available at:

```text
http://localhost:3000
```

Kafka will be available inside the compose network at:

```text
kafka:9092
```

### AWS Deployment Notes

If you deploy on AWS using Docker directly:

1. Build the image with the required public build args.
2. Push it to a container registry such as Amazon ECR.
3. Run it on ECS, EC2, or another container host.
4. Provide runtime environment variables for Kafka and signing.

Important:

- `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_SEPOPLIA_RPC_URL` should be present at build time because they affect the Next.js app bundle.
- Kafka is configured in `docker-compose.yml` as an internal service named `kafka`, so the app uses `KAFKA_BROKERS=kafka:9092` there.
- `docker-compose.yml` uses the public official image `apache/kafka:3.7.0` for local and EC2-style deployments.
- The compose file uses a single-node Kafka KRaft setup suitable for development and small demos. For production, use a managed Kafka cluster or a hardened multi-node setup.

## Kafka Setup

Kafka is optional for local development because the live feed route can fall back to direct contract reads.

If you want full Kafka mode locally, run a broker on:

```dotenv
KAFKA_BROKERS=localhost:9092
```

The live route publishes salary snapshots to:

```dotenv
KAFKA_TOPIC=paydrip.salary.live
```

When Kafka is available, the stream details page shows `Kafka Live`.
When Kafka is unavailable, the page switches to `Live Direct` and continues updating from the chain.

## Main User Flows

### Employer

- Connect MetaMask on Sepolia
- Open employer dashboard
- Create a stream for an employee
- Pause, resume, or terminate active streams

### Employee

- Connect MetaMask on Sepolia
- Open employee dashboard
- Review active streams and available balance
- Open stream details to inspect current status and history
- Withdraw accrued salary from active streams

## Important Files

- [Contracts/contracts/Paydrip.sol](Contracts/contracts/Paydrip.sol)
- [Contracts/test/createStream.test.ts](Contracts/test/createStream.test.ts)
- [Contracts/test/withdraw.test.ts](Contracts/test/withdraw.test.ts)
- [Frontend/app/dashboard/employer/page.tsx](Frontend/app/dashboard/employer/page.tsx)
- [Frontend/app/dashboard/employee/page.tsx](Frontend/app/dashboard/employee/page.tsx)
- [Frontend/app/stream/[id]/page.tsx](Frontend/app/stream/[id]/page.tsx)
- [Frontend/lib/stream-contract.ts](Frontend/lib/stream-contract.ts)
- [Frontend/lib/server/stream-contract.ts](Frontend/lib/server/stream-contract.ts)

## Current Notes

- The contract remains the source of truth.
- Kafka currently carries signed snapshots generated by the Next.js backend, not native on-chain event subscriptions.
- The live details page is designed to stay functional even if Kafka is unavailable.

## License

No license file is currently included in this repository.
