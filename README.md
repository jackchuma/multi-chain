# Lightweight Multi-Rollup System

This is a simple project mocking a multi-rollup evm system for local testing.

A local multi-chain system is incredibly useful for developers building and testing decentralized applications (dApps) that interact with multiple blockchain networks. By setting up a local environment, you can simulate complex interactions between different chains without the need for costly and time-consuming deployments to public testnets. This allows for rapid prototyping, debugging, and ensuring the reliability of your smart contracts in a controlled environment.

This project unlocks a powerful development environment for building and testing multi-chain applications, making you well-equipped to tackle the challenges of multi-chain development and contribute to the growing ecosystem of decentralized applications.

## Getting Started

In order to run this project, you need the following:

- [Node.js](https://nodejs.org/en/download/package-manager) v20
- [Bun](https://bun.sh/docs/installation) v1.1.29
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

## Running the Project

Open four separate terminal windows and navigate to the root directory of the project in each terminal.

Terminal 1:

```bash
make start-mock-L1
```

Terminal 2:

```bash
make start-chain-a
```

Terminal 3:

```bash
make start-chain-b
```

Terminal 4:

```bash
make setup-contracts
```

Terminal 4:

```bash
make start-syncer
```
