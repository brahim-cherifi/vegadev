const { ethers } = require('ethers');
require('dotenv').config();

// Configuration
const CONTRACT_ADDRESS = '0xB6D08194A2c4a41ee353123ff56354fCE221BF79'; // Original Contract
const BSC_RPC = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/';

// Token addresses
const TOKENS = {
    'USDT.z': '0x4BE35Ec329343d7d9F548d42B0F8c17FFfe07db4',
    'USDT': '0x55d398326f99059fF775485246999027B3197955',
    'BUSD': '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    'CAKE': '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    'BNB': '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
};

// ERC20 ABI
const ERC20_ABI = [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint256)',
    'function symbol() external view returns (string)',
    'function decimals() external view returns (uint8)'
];

async function approveToken(tokenSymbol) {
    if (!process.env.PRIVATE_KEY) {
        console.error('❌ Please set PRIVATE_KEY in your .env file');
        return;
    }
    
    const tokenAddress = TOKENS[tokenSymbol];
    if (!tokenAddress) {
        console.error('❌ Token not found:', tokenSymbol);
        console.log('Available tokens:', Object.keys(TOKENS).join(', '));
        return;
    }
    
    const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
    
    try {
        // Get token info
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
        
        // Check current allowance
        const currentAllowance = await tokenContract.allowance(wallet.address, CONTRACT_ADDRESS);
        
        console.log('\n========================================');
        console.log('APPROVAL TRANSACTION');
        console.log('========================================');
        console.log(`Token: ${symbol}`);
        console.log(`Token Address: ${tokenAddress}`);
        console.log(`Spender (Contract): ${CONTRACT_ADDRESS}`);
        console.log(`Current Allowance: ${ethers.utils.formatUnits(currentAllowance, decimals)} ${symbol}`);
        
        if (currentAllowance.gt(0)) {
            console.log('\n⚠️  Token already has approval!');
            const response = await new Promise(resolve => {
                const readline = require('readline').createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                readline.question('Do you want to update approval? (yes/no): ', answer => {
                    readline.close();
                    resolve(answer);
                });
            });
            
            if (response.toLowerCase() !== 'yes') {
                console.log('Approval cancelled.');
                return;
            }
        }
        
        // Set max approval
        const maxApproval = ethers.constants.MaxUint256;
        
        console.log('\n📝 Sending approval transaction...');
        console.log(`Amount: UNLIMITED (MaxUint256)`);
        
        const tx = await tokenContract.approve(CONTRACT_ADDRESS, maxApproval);
        console.log(`\n🔄 Transaction sent: ${tx.hash}`);
        console.log(`View on BSCScan: https://bscscan.com/tx/${tx.hash}`);
        console.log('\nWaiting for confirmation...');
        
        const receipt = await tx.wait();
        console.log(`\n✅ Approval successful!`);
        console.log(`Block: ${receipt.blockNumber}`);
        console.log(`Gas used: ${receipt.gasUsed.toString()}`);
        console.log('\nYou can now swap this token using the contract!');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 'INSUFFICIENT_FUNDS') {
            console.log('Make sure you have enough BNB for gas fees');
        }
    }
}

// Main
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.log('Usage: node approveToken.js <TOKEN_SYMBOL>');
        console.log('Example: node approveToken.js USDT.z');
        console.log('\nAvailable tokens:', Object.keys(TOKENS).join(', '));
        console.log('\n⚠️  Make sure to set PRIVATE_KEY in your .env file');
        return;
    }
    
    await approveToken(args[0]);
}

main().catch(console.error);
