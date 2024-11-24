# default Anvil keys
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CHAIN_A_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
CHAIN_B_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

MOCK_L1_URL=http://localhost:8545
CHAIN_A_URL=http://localhost:8546
CHAIN_B_URL=http://localhost:8547

start-mock-L1:
	cd contracts && anvil

start-chain-a:
	cd contracts && anvil --port 8546 --chain-id 111111

start-chain-b:
	cd contracts && anvil --port 8547 --chain-id 111112

setup-contracts:
	cd contracts && forge script script/DeployRollup.s.sol:DeployRollup --private-key $(PRIVATE_KEY) --rpc-url $(MOCK_L1_URL) --broadcast -vvvv
	cd contracts && forge script script/DeployRollup.s.sol:DeployRollup --private-key $(PRIVATE_KEY) --rpc-url $(MOCK_L1_URL) --broadcast -vvvv
	cd contracts && forge script script/DeployBeaconOracle.s.sol:DeployBeaconOracle --private-key $(PRIVATE_KEY) --rpc-url $(CHAIN_A_URL) --broadcast -vvvv
	cd contracts && forge script script/DeployBeaconOracle.s.sol:DeployBeaconOracle --private-key $(PRIVATE_KEY) --rpc-url $(CHAIN_B_URL) --broadcast -vvvv

start-syncer:
	cd services/syncer && CHAIN_A_KEY=$(CHAIN_A_KEY) CHAIN_B_KEY=$(CHAIN_B_KEY) bun run index.ts

setup-contracts-arbitrum:
	cd contracts &&forge create --rpc-url $(MOCK_L1_URL) --private-key $(PRIVATE_KEY) src/rollups/MockArbitrumRollup.sol:MockArbitrumRollup
	cd contracts &&forge create --rpc-url $(MOCK_L1_URL) --private-key $(PRIVATE_KEY) src/rollups/MockArbitrumRollup.sol:MockArbitrumRollup
	cd contracts && forge script script/DeployBeaconOracle.s.sol:DeployBeaconOracle --private-key $(PRIVATE_KEY) --rpc-url $(CHAIN_A_URL) --broadcast -vvvv

start-syncer-arbitrum:
	cd services/syncer && MODE=arbitrum CHAIN_A_KEY=$(CHAIN_A_KEY) CHAIN_B_KEY=$(CHAIN_B_KEY) bun run index.ts

setup-contracts-opstack:
	cd contracts &&forge create --rpc-url $(MOCK_L1_URL) --private-key $(PRIVATE_KEY) src/rollups/MockOPStackRollup.sol:MockOPStackRollup
	cd contracts &&forge create --rpc-url $(MOCK_L1_URL) --private-key $(PRIVATE_KEY) src/rollups/MockOPStackRollup.sol:MockOPStackRollup
	cd contracts && forge script script/DeployBeaconOracle.s.sol:DeployBeaconOracle --private-key $(PRIVATE_KEY) --rpc-url $(CHAIN_A_URL) --broadcast -vvvv
	cd contracts && forge script script/DeployBeaconOracle.s.sol:DeployBeaconOracle --private-key $(PRIVATE_KEY) --rpc-url $(CHAIN_B_URL) --broadcast -vvvv

start-syncer-opstack:
	cd services/syncer && MODE=opstack CHAIN_A_KEY=$(CHAIN_A_KEY) CHAIN_B_KEY=$(CHAIN_B_KEY) bun run index.ts

start-opstack:
	cd contracts && anvil & \
	cd contracts && anvil --port 8546 --chain-id 111111 & \
	cd contracts && anvil --port 8547 --chain-id 111112 & \
	cd contracts && forge create --rpc-url $(MOCK_L1_URL) --private-key $(PRIVATE_KEY) src/rollups/MockOPStackRollup.sol:MockOPStackRollup && \
	forge create --rpc-url $(MOCK_L1_URL) --private-key $(PRIVATE_KEY) src/rollups/MockOPStackRollup.sol:MockOPStackRollup && \
	forge script script/DeployBeaconOracle.s.sol:DeployBeaconOracle --private-key $(PRIVATE_KEY) --rpc-url $(CHAIN_A_URL) --broadcast -vvvv && \
	forge script script/DeployBeaconOracle.s.sol:DeployBeaconOracle --private-key $(PRIVATE_KEY) --rpc-url $(CHAIN_B_URL) --broadcast -vvvv && \
	cd ../services/syncer && MODE=opstack CHAIN_A_KEY=$(CHAIN_A_KEY) CHAIN_B_KEY=$(CHAIN_B_KEY) bun run index.ts && \
	wait

stop-all-chains:
	kill $(shell lsof -t -i:8545)
	kill $(shell lsof -t -i:8546)
	kill $(shell lsof -t -i:8547)
