# Makefile for Foundry commands
-include .env

.PHONY: all test clean deploy

# Build the project
build:
	forge build

# Run tests
test:
	forge test -vvv

# Deploy KyberSwap version to BSC Mainnet
deploy-kyber-bsc:
	forge script script/DeployKyber.s.sol:DeployKyberScript --rpc-url bsc --broadcast --verify -vvvv

# Deploy KyberSwap version to BSC Testnet
deploy-kyber-testnet:
	forge script script/DeployKyber.s.sol:DeployKyberScript --rpc-url bsc_testnet --broadcast -vvvv

# Deploy PancakeSwap version to BSC Mainnet (legacy)
deploy-pancake-bsc:
	forge script script/Deploy.s.sol:DeployScript --rpc-url bsc --broadcast --verify -vvvv

# Deploy PancakeSwap version to BSC Testnet (legacy)
deploy-pancake-testnet:
	forge script script/Deploy.s.sol:DeployScript --rpc-url bsc_testnet --broadcast -vvvv

# Interact - Swap to USDT
swap-to-usdt:
	forge script script/Interact.s.sol:InteractScript --sig "swapToUSDT()" --rpc-url bsc --broadcast

# Interact - Swap from USDT
swap-from-usdt:
	forge script script/Interact.s.sol:InteractScript --sig "swapFromUSDT()" --rpc-url bsc --broadcast

# Interact - Token to Token
swap-tokens:
	forge script script/Interact.s.sol:InteractScript --sig "swapTokenToToken()" --rpc-url bsc --broadcast

# Interact - Batch swaps
batch-swaps:
	forge script script/Interact.s.sol:InteractScript --sig "batchSwaps()" --rpc-url bsc --broadcast

# Format code
format:
	forge fmt

# Gas snapshot
snapshot:
	forge snapshot

# Clean artifacts
clean:
	forge clean

# Install dependencies
install:
	forge install

# Update dependencies
update:
	forge update
