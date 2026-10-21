import React from 'react';
import { motion } from 'framer-motion';

const QuoteDisplay = ({ quote, tokenFrom, tokenTo }) => {
  if (!quote) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-4 p-4 bg-black/30 rounded-xl border border-purple-500/20"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Rate</span>
          <span className="text-white">
            1 {tokenFrom.symbol} = {quote.rate?.toFixed(6)} {tokenTo.symbol}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Price Impact</span>
          <span className={`font-medium ${
            quote.priceImpact < 1 ? 'text-green-400' : 
            quote.priceImpact < 3 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {quote.priceImpact?.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Minimum Received</span>
          <span className="text-white">
            {quote.minAmountOutFormatted} {tokenTo.symbol}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Network Fee</span>
          <span className="text-white/60">
            ~${quote.gasUsd || '0.35'}
          </span>
        </div>

        {quote.route && quote.route.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <div className="text-white/60 text-sm mb-1">Route</div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-white">{tokenFrom.symbol}</span>
              {quote.routePath?.map((dex, index) => (
                <React.Fragment key={index}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white/40" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-purple-400">{dex}</span>
                </React.Fragment>
              ))}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white/40" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white">{tokenTo.symbol}</span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <div className="flex items-center justify-center text-xs text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Transaction will appear as "execute" on BSCScan
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuoteDisplay;
