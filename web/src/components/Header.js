import React from 'react';
import { motion } from 'framer-motion';

const Header = ({ account, connectWallet, disconnectWallet, isConnecting, chainId }) => {
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId) => {
    switch(chainId) {
      case 56: return 'BSC Mainnet';
      case 97: return 'BSC Testnet';
      default: return 'Unknown Network';
    }
  };

  return (
    <header className="relative z-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <img 
                src="/vegadevdarklogo.png" 
                alt="VEGA DEV" 
                className="w-20 h-20 rounded-xl object-contain hover:scale-110 transition-transform duration-300"
              />
            </motion.div>
            
            {/* Animated Title - Separate from logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.h1 
                className="text-white font-bold text-lg md:text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  duration: 5,
                  ease: "linear",
                  repeat: Infinity,
                }}
                style={{ 
                  backgroundSize: '200% 200%',
                }}
              >
                Private Aggregator
              </motion.h1>
              <motion.p 
                className="text-white/60 text-xs md:text-sm mt-1 hidden md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Powered by VEGA DEV • Best rates from 70+ DEXs
              </motion.p>
            </motion.div>
          </div>

          {/* Network & Wallet */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            {chainId && (
              <div className="glass px-3 py-2 rounded-lg">
                <span className="text-white/80 text-sm flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  {getNetworkName(chainId)}
                </span>
              </div>
            )}
            
            {!account ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : 'Connect Wallet'}
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="glass px-4 py-2 rounded-xl">
                  <span className="text-white font-medium">{formatAddress(account)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="glass hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                  title="Disconnect"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
