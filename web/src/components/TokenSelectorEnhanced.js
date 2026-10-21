import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { TOKENS } from '../config/tokens';

const TokenSelectorEnhanced = ({ isOpen, onClose, onSelect, currentToken, provider }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customTokens, setCustomTokens] = useState([]);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [allTokens, setAllTokens] = useState(TOKENS);

  // Load custom tokens from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customTokens');
    if (saved) {
      const tokens = JSON.parse(saved);
      setCustomTokens(tokens);
      setAllTokens([...TOKENS, ...tokens]);
    }
  }, []);

  // Check if input is a valid address
  const isAddress = (value) => {
    try {
      return ethers.utils.isAddress(value);
    } catch {
      return false;
    }
  };

  // Fetch token details from contract
  const fetchTokenDetails = async (address) => {
    if (!provider) {
      toast.error('Please connect wallet first');
      return null;
    }

    setIsLoadingToken(true);
    try {
      const tokenContract = new ethers.Contract(
        address,
        [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function decimals() view returns (uint8)'
        ],
        provider
      );

      const [name, symbol, decimals] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals()
      ]);

      const newToken = {
        address: address,
        name: name,
        symbol: symbol,
        decimals: decimals,
        logoURI: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${address}/logo.png`,
        isCustom: true
      };

      // Save to localStorage
      const updatedCustomTokens = [...customTokens, newToken];
      setCustomTokens(updatedCustomTokens);
      setAllTokens([...TOKENS, ...updatedCustomTokens]);
      localStorage.setItem('customTokens', JSON.stringify(updatedCustomTokens));

      toast.success(`Added ${symbol} token`);
      return newToken;

    } catch (error) {
      console.error('Error fetching token:', error);
      toast.error('Invalid token address or not a valid BEP-20 token');
      return null;
    } finally {
      setIsLoadingToken(false);
    }
  };

  // Handle search and filtering
  const handleSearch = async () => {
    if (isAddress(searchQuery)) {
      // Check if token already exists
      const exists = allTokens.find(t => 
        t.address.toLowerCase() === searchQuery.toLowerCase()
      );
      
      if (exists) {
        onSelect(exists);
        onClose();
      } else {
        // Fetch and add new token
        const newToken = await fetchTokenDetails(searchQuery);
        if (newToken) {
          onSelect(newToken);
          onClose();
        }
      }
    }
  };

  // Filter tokens based on search
  const filteredTokens = allTokens.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Remove custom token
  const removeCustomToken = (address) => {
    const updated = customTokens.filter(t => t.address !== address);
    setCustomTokens(updated);
    setAllTokens([...TOKENS, ...updated]);
    localStorage.setItem('customTokens', JSON.stringify(updated));
    toast.success('Token removed');
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl glass-dark text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="text-lg font-medium leading-6 text-white p-6 pb-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Select Token</h3>
                    <button
                      onClick={onClose}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </Dialog.Title>

                <div className="px-6 pb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search name, symbol, or paste address"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full bg-black/30 text-white px-4 py-3 pr-24 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/40"
                    />
                    {isAddress(searchQuery) && (
                      <button
                        onClick={handleSearch}
                        disabled={isLoadingToken}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50"
                      >
                        {isLoadingToken ? 'Loading...' : 'Add Token'}
                      </button>
                    )}
                  </div>
                  {isAddress(searchQuery) && (
                    <p className="text-xs text-purple-400 mt-2">
                      💡 Press "Add Token" to import this custom token
                    </p>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {/* Popular tokens section */}
                  {searchQuery === '' && (
                    <div className="px-6 pb-2">
                      <p className="text-white/60 text-sm font-medium">Popular Tokens</p>
                    </div>
                  )}
                  
                  {filteredTokens.map((token) => (
                    <div key={token.address} className="relative group">
                      <button
                        onClick={() => onSelect(token)}
                        disabled={currentToken?.address === token.address}
                        className={`w-full px-6 py-3 flex items-center justify-between hover:bg-white/5 transition-colors ${
                          currentToken?.address === token.address ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img 
                            src={token.logoURI} 
                            alt={token.symbol}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/32?text=' + token.symbol.charAt(0);
                            }}
                          />
                          <div className="text-left">
                            <div className="text-white font-medium flex items-center gap-2">
                              {token.symbol}
                              {token.isCustom && (
                                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Custom</span>
                              )}
                            </div>
                            <div className="text-white/60 text-sm">{token.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {currentToken?.address === token.address && (
                            <span className="text-purple-400 text-sm">Selected</span>
                          )}
                          {token.isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCustomToken(token.address);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 transition-opacity"
                              title="Remove token"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </button>
                    </div>
                  ))}
                  
                  {filteredTokens.length === 0 && (
                    <div className="px-6 py-8 text-center">
                      <p className="text-white/60">No tokens found</p>
                      {isAddress(searchQuery) && (
                        <p className="text-purple-400 mt-2 text-sm">
                          Click "Add Token" above to import this address
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Custom tokens info */}
                {customTokens.length > 0 && (
                  <div className="px-6 py-3 border-t border-white/10">
                    <p className="text-xs text-white/40">
                      {customTokens.length} custom token{customTokens.length > 1 ? 's' : ''} imported
                    </p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TokenSelectorEnhanced;
