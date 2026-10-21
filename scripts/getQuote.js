// KyberSwap Quote Fetcher
// Shows swap quotes before execution

const axios = require('axios');
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

// Load KyberSwap ABI and address
const kyberABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../ABI/KyperABI.json'), 'utf8'));
const kyberAddress = JSON.parse(fs.readFileSync(path.join(__dirname, '../ABI/KyperAggregatorAddress.json'), 'utf8')).address;

// KyberSwap API endpoints
const KYBER_API_BASE = 'https://aggregator-api.kyberswap.com';
const BSC_CHAIN_ID = '56';

// Token addresses on BSC
const TOKENS = {
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    ETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    BTC: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c'
};

// Token decimals
const DECIMALS = {
    [TOKENS.USDT]: 18,
    [TOKENS.BUSD]: 18,
    [TOKENS.WBNB]: 18,
    [TOKENS.CAKE]: 18,
    [TOKENS.ETH]: 18,
    [TOKENS.BTC]: 18
};

/**
 * Get token symbol from address
 */
function getTokenSymbol(address) {
    const tokens = Object.entries(TOKENS);
    for (const [symbol, addr] of tokens) {
        if (addr.toLowerCase() === address.toLowerCase()) {
            return symbol;
        }
    }
    return 'Unknown';
}

/**
 * Format amount with decimals
 */
function formatAmount(amount, decimals = 18) {
    return ethers.utils.formatUnits(amount, decimals);
}

/**
 * Get current token price in USD
 */
async function getTokenPriceUSD(tokenAddress) {
    try {
        const url = `${KYBER_API_BASE}/bsc/api/v1/prices`;
        const response = await axios.get(url, {
            params: { ids: tokenAddress }
        });
        
        if (response.data?.data?.prices?.[0]) {
            return response.data.data.prices[0].marketPrice || 0;
        }
        return 0;
    } catch (error) {
        console.error('Error fetching price:', error.message);
        return 0;
    }
}

/**
 * Get swap quote from KyberSwap
 */
async function getSwapQuote(tokenIn, tokenOut, amountIn, slippageTolerance = 100) {
    try {
        console.log('\n🔍 Fetching Quote from KyberSwap Aggregator...\n');
        
        // Get route from KyberSwap
        const routeUrl = `${KYBER_API_BASE}/bsc/api/v1/routes`;
        const routeParams = {
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            saveGas: false,
            gasInclude: true,
            slippageTolerance: slippageTolerance
        };

        const routeResponse = await axios.get(routeUrl, { params: routeParams });
        
        if (!routeResponse.data?.data?.routeSummary) {
            throw new Error('No route found for this swap');
        }

        const route = routeResponse.data.data.routeSummary;
        
        // Get token prices
        const [tokenInPrice, tokenOutPrice] = await Promise.all([
            getTokenPriceUSD(tokenIn),
            getTokenPriceUSD(tokenOut)
        ]);
        
        // Calculate values
        const amountInFormatted = formatAmount(amountIn, DECIMALS[tokenIn] || 18);
        const amountOutFormatted = formatAmount(route.amountOut, DECIMALS[tokenOut] || 18);
        const amountInUSD = parseFloat(amountInFormatted) * tokenInPrice;
        const amountOutUSD = parseFloat(amountOutFormatted) * tokenOutPrice;
        
        // Calculate effective price and slippage
        const effectivePrice = parseFloat(amountOutFormatted) / parseFloat(amountInFormatted);
        const marketPrice = tokenOutPrice / tokenInPrice;
        const priceDeviation = ((effectivePrice - marketPrice) / marketPrice * 100).toFixed(2);
        
        // Display quote
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                    📊 SWAP QUOTE DETAILS                   ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log(`║ From Token     : ${getTokenSymbol(tokenIn).padEnd(42)} ║`);
        console.log(`║ To Token       : ${getTokenSymbol(tokenOut).padEnd(42)} ║`);
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log(`║ Input Amount   : ${amountInFormatted.padEnd(20)} (~$${amountInUSD.toFixed(2).padEnd(17)}) ║`);
        console.log(`║ Output Amount  : ${amountOutFormatted.padEnd(20)} (~$${amountOutUSD.toFixed(2).padEnd(17)}) ║`);
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log(`║ Exchange Rate  : 1 ${getTokenSymbol(tokenIn)} = ${effectivePrice.toFixed(6)} ${getTokenSymbol(tokenOut)}`.padEnd(60) + ' ║');
        console.log(`║ Price Impact   : ${route.priceImpact}%`.padEnd(60) + ' ║');
        console.log(`║ Price vs Market: ${priceDeviation > 0 ? '+' : ''}${priceDeviation}%`.padEnd(60) + ' ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log(`║ Estimated Gas  : ${route.gasUsd} USD`.padEnd(60) + ' ║');
        console.log(`║ Total Fees     : ~${(parseFloat(route.gasUsd) + Math.abs(amountInUSD - amountOutUSD)).toFixed(2)} USD`.padEnd(60) + ' ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        
        // Show routing path
        if (route.route && route.route.length > 0) {
            console.log('║ 🛣️  Route Path:'.padEnd(61) + '║');
            
            let routePath = [];
            route.route.forEach((hop, index) => {
                hop.forEach(pool => {
                    const exchange = pool.exchange || 'Unknown DEX';
                    const poolInfo = `  ${index + 1}. ${exchange} (${pool.poolLength || 1} pool${pool.poolLength > 1 ? 's' : ''})`;
                    console.log(`║ ${poolInfo.padEnd(58)} ║`);
                });
            });
        }
        
        console.log('╠════════════════════════════════════════════════════════════╣');
        
        // Show minimum received after slippage
        const minAmountOut = ethers.BigNumber.from(route.amountOut)
            .mul(10000 - slippageTolerance)
            .div(10000);
        const minAmountOutFormatted = formatAmount(minAmountOut.toString(), DECIMALS[tokenOut] || 18);
        
        console.log(`║ Min. Received  : ${minAmountOutFormatted} ${getTokenSymbol(tokenOut)} (${(slippageTolerance/100).toFixed(1)}% slippage)`.padEnd(60) + ' ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
        
        // Return quote data for potential execution
        return {
            route: route,
            amountIn: amountIn,
            amountOut: route.amountOut,
            minAmountOut: minAmountOut.toString(),
            priceImpact: route.priceImpact,
            gasUsd: route.gasUsd,
            effectivePrice: effectivePrice,
            amountInUSD: amountInUSD,
            amountOutUSD: amountOutUSD
        };
        
    } catch (error) {
        console.error('\n❌ Error getting quote:', error.message);
        if (error.response?.data) {
            console.error('API Response:', error.response.data);
        }
        throw error;
    }
}

/**
 * Interactive quote with confirmation
 */
async function getQuoteWithConfirmation(tokenIn, tokenOut, amountIn, userAddress, contractAddress) {
    try {
        // Get the quote
        const quote = await getSwapQuote(tokenIn, tokenOut, amountIn);
        
        console.log('\n📝 To execute this swap through ObfuscatedSwapper:');
        console.log('─────────────────────────────────────────────────');
        
        // Build the swap execution data
        const swapUrl = `${KYBER_API_BASE}/bsc/api/v1/route/build`;
        const swapParams = {
            routeSummary: quote.route,
            slippageTolerance: 100, // 1%
            sender: contractAddress, // Important: contract is the sender
            recipient: contractAddress, // Contract receives first
            skipSimulateTx: false
        };
        
        const swapResponse = await axios.post(swapUrl, swapParams);
        const swapData = swapResponse.data.data;
        
        // Show execution data
        console.log('\n🔧 Execution Parameters:');
        console.log(`Contract Address: ${contractAddress}`);
        console.log(`KyberSwap Router: ${swapData.routerAddress}`);
        console.log(`Call Data Length: ${swapData.data.length} bytes`);
        
        // Encode for ObfuscatedSwapper
        const abiCoder = new ethers.utils.AbiCoder();
        let encodedData;
        
        if (tokenOut.toLowerCase() === TOKENS.USDT.toLowerCase()) {
            // Operation 2: Token to USDT
            encodedData = abiCoder.encode(
                ['address', 'uint256', 'uint256', 'address', 'bytes'],
                [tokenIn, amountIn, quote.minAmountOut, userAddress, swapData.data]
            );
            console.log('\nOperation Type: 2 (Token to USDT)');
        } else if (tokenIn.toLowerCase() === TOKENS.USDT.toLowerCase()) {
            // Operation 3: USDT to Token
            encodedData = abiCoder.encode(
                ['address', 'uint256', 'uint256', 'address', 'bytes'],
                [tokenOut, amountIn, quote.minAmountOut, userAddress, swapData.data]
            );
            console.log('Operation Type: 3 (USDT to Token)');
        } else {
            // Operation 1: Token to Token
            encodedData = abiCoder.encode(
                ['address', 'address', 'uint256', 'uint256', 'address', 'bytes'],
                [tokenIn, tokenOut, amountIn, quote.minAmountOut, userAddress, swapData.data]
            );
            console.log('Operation Type: 1 (Token to Token)');
        }
        
        console.log('\n✅ Ready to execute!');
        console.log('You will receive at least:', formatAmount(quote.minAmountOut, DECIMALS[tokenOut] || 18), getTokenSymbol(tokenOut));
        
        return {
            quote: quote,
            swapData: swapData.data,
            encodedData: encodedData,
            operation: tokenOut.toLowerCase() === TOKENS.USDT.toLowerCase() ? 2 : 
                       tokenIn.toLowerCase() === TOKENS.USDT.toLowerCase() ? 3 : 1
        };
        
    } catch (error) {
        console.error('Failed to prepare swap:', error.message);
        throw error;
    }
}

/**
 * Example usage
 */
async function example() {
    // Example: Get quote for swapping 100 BUSD to CAKE
    const tokenIn = TOKENS.BUSD;
    const tokenOut = TOKENS.CAKE;
    const amountIn = ethers.utils.parseEther('100'); // 100 BUSD
    
    console.log('Getting quote for: 100 BUSD → CAKE');
    
    try {
        // Just get quote
        await getSwapQuote(tokenIn, tokenOut, amountIn);
        
        // Or get quote with execution data
        // const userAddress = '0xYOUR_WALLET_ADDRESS';
        // const contractAddress = '0xYOUR_CONTRACT_ADDRESS';
        // const result = await getQuoteWithConfirmation(tokenIn, tokenOut, amountIn, userAddress, contractAddress);
        // console.log('\nEncoded data for contract:', result.encodedData);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Export functions
module.exports = {
    getSwapQuote,
    getQuoteWithConfirmation,
    TOKENS,
    getTokenSymbol,
    formatAmount
};

// Run if called directly
if (require.main === module) {
    // Parse command line arguments
    const args = process.argv.slice(2);
    
    if (args.length >= 3) {
        const tokenIn = TOKENS[args[0].toUpperCase()] || args[0];
        const tokenOut = TOKENS[args[1].toUpperCase()] || args[1];
        const amount = ethers.utils.parseEther(args[2]);
        
        console.log(`\n💱 Quote Request: ${args[2]} ${args[0].toUpperCase()} → ${args[1].toUpperCase()}\n`);
        getSwapQuote(tokenIn, tokenOut, amount).catch(console.error);
    } else {
        console.log('\nUsage: node getQuote.js <TOKEN_IN> <TOKEN_OUT> <AMOUNT>');
        console.log('Example: node getQuote.js BUSD CAKE 100\n');
        console.log('Running example quote...');
        example();
    }
}
