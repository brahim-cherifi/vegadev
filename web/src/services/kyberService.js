import axios from 'axios';
import { ethers } from 'ethers';

const KYBER_API_BASE = 'https://aggregator-api.kyberswap.com';
const BSC_CHAIN_ID = '56';

/**
 * Get swap quote from KyberSwap
 */
export const getQuote = async (tokenIn, tokenOut, amountIn, slippageTolerance = 100) => {
  try {
    // Build the route request
    const routeUrl = `${KYBER_API_BASE}/bsc/api/v1/routes`;
    const routeParams = {
      tokenIn,
      tokenOut,
      amountIn,
      saveGas: false,
      gasInclude: true,
      slippageTolerance
    };

    const response = await axios.get(routeUrl, { params: routeParams });
    
    if (!response.data?.data?.routeSummary) {
      throw new Error('No route found');
    }

    const route = response.data.data.routeSummary;
    
    // Calculate minimum amount out
    const minAmountOut = ethers.BigNumber.from(route.amountOut)
      .mul(10000 - slippageTolerance)
      .div(10000);
    
    // Extract route path for display
    const routePath = [];
    if (route.route && route.route.length > 0) {
      route.route.forEach(hop => {
        hop.forEach(pool => {
          const exchange = pool.exchange || 'Unknown';
          if (!routePath.includes(exchange)) {
            routePath.push(exchange);
          }
        });
      });
    }
    
    return {
      route,
      amountOut: route.amountOut,
      amountOutDecimal: route.amountOutDecimal,
      minAmountOut: minAmountOut.toString(),
      minAmountOutFormatted: ethers.utils.formatUnits(minAmountOut, 18),
      priceImpact: parseFloat(route.priceImpact || 0),
      gasUsd: route.gasUsd,
      gas: route.gas,
      rate: parseFloat(route.amountOutDecimal) / parseFloat(ethers.utils.formatUnits(amountIn, 18)),
      routePath
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};

/**
 * Build swap transaction for execution
 */
export const buildSwapTransaction = async (routeSummary, sender, slippageTolerance = 100) => {
  try {
    const swapUrl = `${KYBER_API_BASE}/bsc/api/v1/route/build`;
    const swapParams = {
      routeSummary,
      slippageTolerance,
      sender,
      recipient: sender, // Contract will handle final recipient
      skipSimulateTx: false
    };

    const response = await axios.post(swapUrl, swapParams);
    
    if (!response.data?.data?.data) {
      throw new Error('Failed to build swap transaction');
    }
    
    return response.data.data.data;
  } catch (error) {
    console.error('Error building swap:', error);
    throw error;
  }
};

/**
 * Get token price in USD
 */
export const getTokenPrice = async (tokenAddress) => {
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
    console.error('Error fetching token price:', error);
    return 0;
  }
};
