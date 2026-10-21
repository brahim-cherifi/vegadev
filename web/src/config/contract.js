// Contract configuration
// ORIGINAL CONTRACT: Standard swap - input and output to same wallet
export const CONTRACT_ADDRESS = '0xB6D08194A2c4a41ee353123ff56354fCE221BF79';

export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "operation",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "execute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "authorized",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// KyberSwap Aggregator Router on BSC
export const KYBER_AGGREGATOR = '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5';
