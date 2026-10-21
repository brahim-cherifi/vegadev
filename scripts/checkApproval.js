const { ethers } = require('ethers');

// Configuration
const CONTRACT_ADDRESS = '0xB6D08194A2c4a41ee353123ff56354fCE221BF79'; // Original Contract
const BSC_RPC = 'https://bsc-dataseed.binance.org/';

// Token addresses
const TOKENS = {
    'USDT.z': '0x4BE35Ec329343d7d9F548d42B0F8c17FFfe07db4',
    'USDT': '0x55d398326f99059fF775485246999027B3197955',
    'BUSD': '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
};

// ERC20 ABI for approval
const ERC20_ABI = [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint256)',
    'function balanceOf(address account) external view returns (uint256)',
    'function decimals() external view returns (uint8)',
    'function symbol() external view returns (string)'
];

async function checkApproval(userAddress, tokenSymbol) {
    const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
    const tokenAddress = TOKENS[tokenSymbol];
    
    if (!tokenAddress) {
        console.error('❌ Token not found:', tokenSymbol);
        return;
    }
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    try {
        // Get token info
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
        
        // Check allowance
        const allowance = await tokenContract.allowance(userAddress, CONTRACT_ADDRESS);
        const balance = await tokenContract.balanceOf(userAddress);
        
        console.log('\n========================================');
        console.log(`Token: ${symbol} (${tokenAddress})`);
        console.log(`Contract: ${CONTRACT_ADDRESS}`);
        console.log('========================================');
        console.log(`Your Balance: ${ethers.utils.formatUnits(balance, decimals)} ${symbol}`);
        console.log(`Current Allowance: ${ethers.utils.formatUnits(allowance, decimals)} ${symbol}`);
        
        if (allowance.eq(0)) {
            console.log('\n⚠️  WARNING: No approval!');
            console.log('The contract cannot spend your tokens.');
            console.log('\n📝 To fix this:');
            console.log('1. Go to the token contract on BSCScan');
            console.log(`   https://bscscan.com/token/${tokenAddress}#writeContract`);
            console.log('2. Connect your wallet');
            console.log('3. Find "approve" function');
            console.log(`4. Set spender: ${CONTRACT_ADDRESS}`);
            console.log('5. Set amount: 115792089237316195423570985008687907853269984665640564039457584007913129639935');
            console.log('   (this is MAX_UINT256 for unlimited approval)');
            console.log('6. Write and confirm transaction\n');
        } else if (allowance.lt(ethers.utils.parseUnits('1000000', decimals))) {
            console.log('\n⚠️  Low approval detected');
            console.log('Consider increasing approval amount');
        } else {
            console.log('\n✅ Approval is set! You can swap this token.');
        }
        
    } catch (error) {
        console.error('Error checking approval:', error);
    }
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('Usage: node checkApproval.js <YOUR_WALLET_ADDRESS> <TOKEN_SYMBOL>');
        console.log('Example: node checkApproval.js 0x232a... USDT.z');
        console.log('\nAvailable tokens:', Object.keys(TOKENS).join(', '));
        return;
    }
    
    const [userAddress, tokenSymbol] = args;
    await checkApproval(userAddress, tokenSymbol);
}

main().catch(console.error);
