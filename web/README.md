# ObfuscatedSwap DEX Interface

A modern, fully-functional DEX interface for the KyberSwap Obfuscated Swapper smart contract. Built with React and Web3.

## Features

✨ **Complete DEX Experience**
- Professional swap interface like Uniswap/PancakeSwap
- Real-time quotes from KyberSwap aggregator
- Token selector with search functionality
- Slippage tolerance settings
- Beautiful glassmorphism design

🔒 **Privacy Features**
- Swaps appear as generic `execute()` calls on BSCScan
- Obfuscated transaction labeling
- Private routing through smart contract

💎 **Advanced Features**
- Best rates from 70+ DEXs via KyberSwap
- Automatic token approval handling
- Real-time balance updates
- Price impact warnings
- Route visualization
- Mobile responsive design

## Quick Start

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your deployed contract address:
```
REACT_APP_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
```

### 3. Start Development Server

```bash
npm start
```

Opens at http://localhost:3000

### 4. Build for Production

```bash
npm run build
```

Creates optimized build in `build/` directory.

## Deployment Options

### Option 1: Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --dir=build --prod
```

### Option 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 3: Deploy to GitHub Pages

1. Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/obfuscated-swap"
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add deploy script to `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

4. Deploy:
```bash
npm run deploy
```

### Option 4: Host on IPFS

1. Build the project:
```bash
npm run build
```

2. Upload to IPFS using Pinata or Infura:
```bash
# Using IPFS CLI
ipfs add -r build/
```

## User Guide

### Connecting Wallet

1. Click "Connect Wallet" button
2. Approve connection in MetaMask
3. Ensure you're on BSC Mainnet (chainId: 56)

### Making a Swap

1. **Select Tokens**: Click on token buttons to open selector
2. **Enter Amount**: Type the amount you want to swap
3. **Review Quote**: Check rate, price impact, and route
4. **Approve Token**: First-time swaps require token approval
5. **Execute Swap**: Click "Swap" and confirm in wallet
6. **View Transaction**: Check BSCScan link (shows as "execute")

### Settings

- **Slippage Tolerance**: Choose between 0.5%, 1%, 2%, or 3%
- **Higher slippage** = More likely to succeed
- **Lower slippage** = Better price protection

## Technical Stack

- **Frontend**: React 18 with Hooks
- **Styling**: TailwindCSS with glassmorphism effects
- **Web3**: Ethers.js v5
- **UI Components**: Headless UI, Framer Motion
- **Notifications**: React Hot Toast
- **API**: KyberSwap Aggregator API

## Smart Contract Integration

The interface interacts with your deployed `KyberObfuscatedSwapper` contract:

- **Operation 1**: Token to Token swap
- **Operation 2**: Any Token to USDT
- **Operation 3**: USDT to Any Token
- **Operation 4**: Multi-hop optimized swap

All swaps are routed through KyberSwap for best rates across BSC DEXs.

## Customization

### Adding New Tokens

Edit `src/config/tokens.js`:

```javascript
{
  symbol: 'NEW',
  name: 'New Token',
  address: '0x...',
  decimals: 18,
  logoURI: 'https://...'
}
```

### Changing Theme

Modify colors in `tailwind.config.js` and `src/index.css`.

### Contract Address

Update in `.env`:
```
REACT_APP_CONTRACT_ADDRESS=0xNEW_ADDRESS
```

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never share your private keys**
2. **Verify contract address** before swapping
3. **Check price impact** warnings
4. **Use appropriate slippage** for volatile tokens
5. **Test with small amounts** first

## Troubleshooting

**Wallet not connecting?**
- Ensure MetaMask is installed
- Check you're on BSC network
- Try refreshing the page

**Quote not loading?**
- Check internet connection
- Verify token addresses are correct
- Try different token pairs

**Swap failing?**
- Increase slippage tolerance
- Check token balance
- Ensure enough BNB for gas

**High price impact?**
- Try smaller amounts
- Choose more liquid pairs
- Check if route is optimal

## Performance

- ⚡ Instant quote fetching
- 🚀 Optimized React rendering
- 📦 Code splitting for fast loads
- 🎨 Smooth animations at 60fps
- 📱 Mobile optimized

## License

MIT
