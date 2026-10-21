// KyberSwap Helper Script
// This script helps you build the swap data for KyberSwap aggregator off-chain

const axios = require('axios');
const ethers = require('ethers');

// KyberSwap API endpoints
const KYBER_API_BASE = 'https://aggregator-api.kyberswap.com';
const BSC_CHAIN_ID = '56';

// Token addresses on BSC
const TOKENS = {
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    BNB: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
};

/**
 * Get swap route from KyberSwap API
 */
async function getSwapRoute(tokenIn, tokenOut, amountIn, userAddress, slippageTolerance = 100) {
    try {
        // Get route
        const routeUrl = `${KYBER_API_BASE}/bsc/api/v1/routes`;
        const routeParams = {
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            saveGas: false,
            gasInclude: true,
            slippageTolerance: slippageTolerance // 100 = 1%
        };

        console.log('Getting best route from KyberSwap...');
        const routeResponse = await axios.get(routeUrl, { params: routeParams });
        
        if (!routeResponse.data.data.routeSummary) {
            throw new Error('No route found');
        }

        const route = routeResponse.data.data.routeSummary;
        
        console.log('\n=== Route Summary ===');
        console.log(`Input: ${ethers.utils.formatEther(amountIn)} tokens`);
        console.log(`Expected Output: ${ethers.utils.formatEther(route.amountOut)} tokens`);
        console.log(`Price Impact: ${route.priceImpact}%`);
        console.log(`Gas Cost: ${route.gasUsd} USD`);
        
        // Build swap transaction
        const swapUrl = `${KYBER_API_BASE}/bsc/api/v1/route/build`;
        const swapParams = {
            routeSummary: route,
            slippageTolerance: slippageTolerance,
            sender: userAddress,
            recipient: userAddress,
            skipSimulateTx: false
        };

        console.log('\nBuilding swap transaction...');
        const swapResponse = await axios.post(swapUrl, swapParams);
        
        const swapData = swapResponse.data.data;
        
        return {
            routeSummary: route,
            swapData: swapData.data,
            to: swapData.routerAddress,
            value: swapData.value || '0',
            amountOut: route.amountOut,
            priceImpact: route.priceImpact,
            gas: route.gas
        };
        
    } catch (error) {
        console.error('Error getting swap route:', error.message);
        throw error;
    }
}

/**
 * Encode data for ObfuscatedSwapper contract
 */
function encodeSwapData(operation, tokenIn, tokenOut, amountIn, minAmountOut, recipient, kyberSwapData) {
    const abiCoder = new ethers.utils.AbiCoder();
    
    if (operation === 1) {
        // Token to token swap
        return abiCoder.encode(
            ['address', 'address', 'uint256', 'uint256', 'address', 'bytes'],
            [tokenIn, tokenOut, amountIn, minAmountOut, recipient, kyberSwapData]
        );
    } else if (operation === 2) {
        // Token to USDT
        return abiCoder.encode(
            ['address', 'uint256', 'uint256', 'address', 'bytes'],
            [tokenIn, amountIn, minAmountOut, recipient, kyberSwapData]
        );
    } else if (operation === 3) {
        // USDT to token
        return abiCoder.encode(
            ['address', 'uint256', 'uint256', 'address', 'bytes'],
            [tokenOut, amountIn, minAmountOut, recipient, kyberSwapData]
        );
    } else if (operation === 4) {
        // Optimized multi-hop
        return abiCoder.encode(
            ['address[]', 'uint256', 'uint256', 'address', 'bytes'],
            [[tokenIn, tokenOut], amountIn, minAmountOut, recipient, kyberSwapData]
        );
    }
}

/**
 * Example: Build swap from BUSD to CAKE
 */
async function exampleSwap() {
    const userAddress = '0xYOUR_WALLET_ADDRESS';
    const obfuscatedSwapperAddress = '0xYOUR_CONTRACT_ADDRESS';
    
    // 100 BUSD
    const amountIn = ethers.utils.parseEther('100');
    
    try {
        // Get best route from KyberSwap
        const result = await getSwapRoute(
            TOKENS.BUSD,
            TOKENS.CAKE,
            amountIn.toString(),
            obfuscatedSwapperAddress, // Important: use contract as recipient
            100 // 1% slippage
        );
        
        console.log('\n=== Swap Data for ObfuscatedSwapper ===');
        
        // Calculate min amount out with slippage
        const minAmountOut = ethers.BigNumber.from(result.amountOut)
            .mul(99).div(100); // 1% slippage
        
        // Encode for operation 1 (token to token)
        const encodedData = encodeSwapData(
            1, // operation code
            TOKENS.BUSD,
            TOKENS.CAKE,
            amountIn,
            minAmountOut,
            userAddress, // final recipient
            result.swapData
        );
        
        console.log('\nOperation Code: 1');
        console.log('Encoded Data:', encodedData);
        console.log('\nUse this data with ObfuscatedSwapper.execute(1, encodedData)');
        
        return {
            operation: 1,
            encodedData: encodedData,
            expectedOutput: result.amountOut,
            priceImpact: result.priceImpact
        };
        
    } catch (error) {
        console.error('Failed to build swap:', error);
    }
}

/**
 * Get token prices from KyberSwap
 */
async function getTokenPrice(tokenAddress) {
    try {
        const url = `${KYBER_API_BASE}/bsc/api/v1/prices`;
        const params = {
            ids: tokenAddress
        };
        
        const response = await axios.get(url, { params });
        return response.data.data.prices[0];
        
    } catch (error) {
        console.error('Error getting token price:', error);
        return null;
    }
}

// Export functions
module.exports = {
    getSwapRoute,
    encodeSwapData,
    getTokenPrice,
    TOKENS
};

// Run example if called directly
if (require.main === module) {
    exampleSwap();
}
