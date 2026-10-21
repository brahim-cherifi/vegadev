import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { TOKENS } from '../config/tokens';

const TokenSelector = ({ isOpen, onClose, onSelect, currentToken }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = TOKENS.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <input
                    type="text"
                    placeholder="Search by name or symbol"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/30 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 placeholder-white/40"
                  />
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredTokens.map((token) => (
                    <button
                      key={token.address}
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
                            e.target.src = 'https://via.placeholder.com/32';
                          }}
                        />
                        <div className="text-left">
                          <div className="text-white font-medium">{token.symbol}</div>
                          <div className="text-white/60 text-sm">{token.name}</div>
                        </div>
                      </div>
                      {currentToken?.address === token.address && (
                        <span className="text-purple-400 text-sm">Selected</span>
                      )}
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TokenSelector;
