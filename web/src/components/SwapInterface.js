import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import TokenSelectorEnhanced from './TokenSelectorEnhanced';
import QuoteDisplay from './QuoteDisplay';
import { getQuote, buildSwapTransaction } from '../services/kyberService';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import { TOKENS } from '../config/tokens';

const SwapInterface = ({ account, provider, signer, chainId }) => {
  const [tokenFrom, setTokenFrom] = useState(TOKENS[0]); // USDT.z as default
  const [tokenTo, setTokenTo] = useState(TOKENS[3]); // CAKE
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quote, setQuote] = useState(null);
  const [slippage, setSlippage] = useState(1); // 1%
  const [isSwapping, setIsSwapping] = useState(false);
  const [balances, setBalances] = useState({});
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [selectingTokenFor, setSelectingTokenFor] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // ERC20 ABI for balance and approval
  const ERC20_ABI = [
    'function balanceOf(address) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)'
  ];

  // Fetch token balances
  useEffect(() => {
    if (account && provider) {
      fetchBalances();
    }
  }, [account, provider, tokenFrom, tokenTo]);

  const fetchBalances = async () => {
    if (!account || !provider) return;

    const newBalances = {};
    
    for (const token of [tokenFrom, tokenTo]) {
      if (token.address === 'BNB') {
        // Native BNB balance
        const balance = await provider.getBalance(account);
        newBalances[token.address] = ethers.utils.formatEther(balance);
      } else {
        // ERC20 token balance
        try {
          const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const balance = await contract.balanceOf(account);
          newBalances[token.address] = ethers.utils.formatUnits(balance, token.decimals);
        } catch (error) {
          newBalances[token.address] = '0';
        }
      }
    }
    
    setBalances(newBalances);
  };

  // Fetch quote when amount changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (amountFrom && parseFloat(amountFrom) > 0) {
        fetchQuote();
      } else {
        setQuote(null);
        setAmountTo('');
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [amountFrom, tokenFrom, tokenTo, slippage]);

  const fetchQuote = async () => {
    if (!amountFrom || parseFloat(amountFrom) <= 0) return;

    setIsLoadingQuote(true);
    try {
      const amountInWei = ethers.utils.parseUnits(amountFrom, tokenFrom.decimals);
      const quoteData = await getQuote(
        tokenFrom.address,
        tokenTo.address,
        amountInWei.toString(),
        slippage * 100
      );
      
      setQuote(quoteData);
      const outputAmount = ethers.utils.formatUnits(quoteData.amountOut, tokenTo.decimals);
      setAmountTo(parseFloat(outputAmount).toFixed(6));
    } catch (error) {
      console.error('Error fetching quote:', error);
      toast.error('Failed to fetch quote');
      setQuote(null);
      setAmountTo('');
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const handleSwap = async () => {
    if (!account || !signer || !quote) {
      toast.error('Please connect wallet and enter amount');
      return;
    }

    setIsSwapping(true);
    const loadingToast = toast.loading('Processing swap...');

    try {
      const amountInWei = ethers.utils.parseUnits(amountFrom, tokenFrom.decimals);
      
      // Check and handle token approval
      if (tokenFrom.address !== 'BNB') {
        const tokenContract = new ethers.Contract(tokenFrom.address, ERC20_ABI, signer);
        const allowance = await tokenContract.allowance(account, CONTRACT_ADDRESS);
        
        if (allowance.lt(amountInWei)) {
          toast.loading('Approving token...', { id: loadingToast });
          const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, ethers.constants.MaxUint256);
          await approveTx.wait();
        }
      }

      // Build swap transaction
      toast.loading('Building swap transaction...', { id: loadingToast });
      const swapData = await buildSwapTransaction(
        quote.route,
        CONTRACT_ADDRESS,
        slippage * 100
      );

      // Determine operation type
      let operation;
      let encodedData;
      const abiCoder = new ethers.utils.AbiCoder();

      if (tokenTo.address === TOKENS.find(t => t.symbol === 'USDT').address) {
        operation = 2; // Token to USDT
        encodedData = abiCoder.encode(
          ['address', 'uint256', 'uint256', 'address', 'bytes'],
          [tokenFrom.address, amountInWei, quote.minAmountOut, account, swapData]
        );
      } else if (tokenFrom.address === TOKENS.find(t => t.symbol === 'USDT').address) {
        operation = 3; // USDT to token
        encodedData = abiCoder.encode(
          ['address', 'uint256', 'uint256', 'address', 'bytes'],
          [tokenTo.address, amountInWei, quote.minAmountOut, account, swapData]
        );
      } else {
        operation = 1; // Token to token
        encodedData = abiCoder.encode(
          ['address', 'address', 'uint256', 'uint256', 'address', 'bytes'],
          [tokenFrom.address, tokenTo.address, amountInWei, quote.minAmountOut, account, swapData]
        );
      }

      // Execute swap
      toast.loading('Executing swap...', { id: loadingToast });
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.execute(operation, encodedData, {
        value: tokenFrom.address === 'BNB' ? amountInWei : 0,
        gasLimit: 500000
      });

      toast.loading('Waiting for confirmation...', { id: loadingToast });
      const receipt = await tx.wait();

      toast.success('Swap completed successfully!', { id: loadingToast });
      
      // Show transaction link
      toast.success(
        <div>
          <a 
            href={`https://bscscan.com/tx/${receipt.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on BSCScan
          </a>
        </div>,
        { duration: 10000 }
      );

      // Reset form
      setAmountFrom('');
      setAmountTo('');
      setQuote(null);
      fetchBalances();

    } catch (error) {
      console.error('Swap error:', error);
      toast.error(error.message || 'Swap failed', { id: loadingToast });
    } finally {
      setIsSwapping(false);
    }
  };

  const handleTokenSwitch = () => {
    setTokenFrom(tokenTo);
    setTokenTo(tokenFrom);
    setAmountFrom('');
    setAmountTo('');
    setQuote(null);
  };

  const openTokenSelector = (forToken) => {
    setSelectingTokenFor(forToken);
    setShowTokenSelector(true);
  };

  const handleTokenSelect = (token) => {
    if (selectingTokenFor === 'from') {
      if (token.address === tokenTo.address) {
        handleTokenSwitch();
      } else {
        setTokenFrom(token);
      }
    } else {
      if (token.address === tokenFrom.address) {
        handleTokenSwitch();
      } else {
        setTokenTo(token);
      }
    }
    setShowTokenSelector(false);
    setAmountFrom('');
    setAmountTo('');
    setQuote(null);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <div className="glass-dark rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Swap</h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-4 p-4 bg-black/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Slippage Tolerance</span>
                <span className="text-white font-medium">{slippage}%</span>
              </div>
              <div className="flex space-x-2">
                {[0.5, 1, 2, 3].map(value => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`flex-1 py-1 rounded-lg text-sm font-medium transition-colors ${
                      slippage === value 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* From Token */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">From</span>
              {balances[tokenFrom?.address] && (
                <span className="text-white/60 text-sm">
                  Balance: {parseFloat(balances[tokenFrom.address]).toFixed(4)}
                </span>
              )}
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openTokenSelector('from')}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <img 
                    src={tokenFrom.logoURI} 
                    alt={tokenFrom.symbol}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/24';
                    }}
                  />
                  <span className="text-white font-medium">{tokenFrom.symbol}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/60" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <input
                  type="number"
                  value={amountFrom}
                  onChange={(e) => setAmountFrom(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-white text-2xl outline-none text-right"
                />
              </div>
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleTokenSwitch}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-xl transition-all hover:rotate-180 duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.894.553l3 6A1 1 0 0113 11H8.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0L8.414 9H13a1 1 0 01.894-.553l3 6A1 1 0 0117 17a1 1 0 01-1-1v-5H8a1 1 0 01-.894-1.447l3-6A1 1 0 0110 3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* To Token */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">To</span>
              {balances[tokenTo?.address] && (
                <span className="text-white/60 text-sm">
                  Balance: {parseFloat(balances[tokenTo.address]).toFixed(4)}
                </span>
              )}
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openTokenSelector('to')}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <img 
                    src={tokenTo.logoURI} 
                    alt={tokenTo.symbol}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/24';
                    }}
                  />
                  <span className="text-white font-medium">{tokenTo.symbol}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/60" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <input
                  type="number"
                  value={amountTo}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-white text-2xl outline-none text-right"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Quote Display */}
          {quote && <QuoteDisplay quote={quote} tokenFrom={tokenFrom} tokenTo={tokenTo} />}

          {/* Swap Button */}
          {!account ? (
            <button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => toast.error('Please connect wallet first')}
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={handleSwap}
              disabled={!amountFrom || !quote || isSwapping || isLoadingQuote}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSwapping ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isLoadingQuote ? (
                'Fetching Quote...'
              ) : !amountFrom || parseFloat(amountFrom) <= 0 ? (
                'Enter Amount'
              ) : !quote ? (
                'No Route Available'
              ) : (
                'Swap'
              )}
            </button>
          )}
        </div>
      </motion.div>

      {/* Enhanced Token Selector Modal */}
      <TokenSelectorEnhanced
        isOpen={showTokenSelector}
        onClose={() => setShowTokenSelector(false)}
        onSelect={handleTokenSelect}
        currentToken={selectingTokenFor === 'from' ? tokenFrom : tokenTo}
        provider={provider}
      />
    </>
  );
};

export default SwapInterface;
