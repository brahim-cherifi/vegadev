// Interactive Swap Executor with Quote Display
// Shows quote first, then executes if confirmed

const ethers = require('ethers');
const readline = require('readline');
const { getSwapQuote, getQuoteWithConfirmation, TOKENS, getTokenSymbol, formatAmount } = require('./getQuote');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load contract ABI
const contractABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "operation", "type": "uint256"},
            {"internalType": "bytes", "name": "data", "type": "bytes"}
        ],
        "name": "execute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Ask user for confirmation
 */
function askConfirmation(question) {
    return new Promise((resolve) => {
        rl.question(question + ' (yes/no): ', (answer) => {
            resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
        });
    });
}

/**
 * Execute swap on chain
 */
async function executeSwap(operation, encodedData, contractAddress, value = '0') {
    try {
        // Connect to BSC
        const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/');
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        // Connect to contract
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        
        console.log('\n📤 Sending transaction...');
        
        // Execute the swap
        const tx = await contract.execute(operation, encodedData, {
            value: value,
            gasLimit: 500000 // Adjust as needed
        });
        
        console.log(`\n✅ Transaction sent!`);
        console.log(`📋 Transaction Hash: ${tx.hash}`);
        console.log(`🔗 View on BSCScan: https://bscscan.com/tx/${tx.hash}`);
        console.log('\n⏳ Waiting for confirmation...');
        
        // Wait for confirmation
        const receipt = await tx.wait();
        
        console.log(`\n✅ Transaction confirmed!`);
        console.log(`⛽ Gas Used: ${receipt.gasUsed.toString()}`);
        console.log(`📦 Block Number: ${receipt.blockNumber}`);
        console.log('\n🎉 Swap completed successfully!');
        console.log('📝 Note: On BSCScan, this appears as "execute" not "swap"');
        
        return receipt;
        
    } catch (error) {
        console.error('\n❌ Transaction failed:', error.message);
        throw error;
    }
}

/**
 * Main interactive swap flow
 */
async function interactiveSwap() {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║     KyberSwap Obfuscated Swap Executor    ║');
    console.log('╚════════════════════════════════════════════╝\n');
    
    // Check for required environment variables
    if (!process.env.PRIVATE_KEY) {
        console.error('❌ Error: PRIVATE_KEY not found in .env file');
        process.exit(1);
    }
    
    if (!process.env.CONTRACT_ADDRESS) {
        console.error('❌ Error: CONTRACT_ADDRESS not found in .env file');
        process.exit(1);
    }
    
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    // Get user's wallet address
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const userAddress = wallet.address;
    
    console.log(`📱 Your Wallet: ${userAddress}`);
    console.log(`📄 Contract: ${contractAddress}`);
    console.log('\n─────────────────────────────────────────────');
    
    // Show available tokens
    console.log('\n📜 Available Tokens:');
    Object.keys(TOKENS).forEach(token => {
        console.log(`   • ${token}`);
    });
    
    // Get swap parameters from user
    const tokenInSymbol = await new Promise(resolve => {
        rl.question('\n🔹 Enter token to swap FROM (e.g., BUSD): ', resolve);
    });
    
    const tokenOutSymbol = await new Promise(resolve => {
        rl.question('🔹 Enter token to swap TO (e.g., CAKE): ', resolve);
    });
    
    const amountStr = await new Promise(resolve => {
        rl.question(`🔹 Enter amount of ${tokenInSymbol} to swap: `, resolve);
    });
    
    // Validate inputs
    const tokenIn = TOKENS[tokenInSymbol.toUpperCase()];
    const tokenOut = TOKENS[tokenOutSymbol.toUpperCase()];
    
    if (!tokenIn || !tokenOut) {
        console.error('\n❌ Invalid token symbol');
        rl.close();
        return;
    }
    
    const amountIn = ethers.utils.parseEther(amountStr);
    
    try {
        // Get and display quote
        console.log('\n⏳ Fetching quote from KyberSwap...');
        const result = await getQuoteWithConfirmation(tokenIn, tokenOut, amountIn, userAddress, contractAddress);
        
        // Ask for confirmation
        console.log('\n─────────────────────────────────────────────');
        const confirmed = await askConfirmation('\n🤔 Do you want to proceed with this swap?');
        
        if (confirmed) {
            // Check token approval first
            console.log('\n🔓 Checking token approval...');
            const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/');
            const tokenContract = new ethers.Contract(
                tokenIn,
                ['function allowance(address,address) view returns (uint256)',
                 'function approve(address,uint256) returns (bool)'],
                wallet.connect(provider)
            );
            
            const allowance = await tokenContract.allowance(userAddress, contractAddress);
            
            if (allowance.lt(amountIn)) {
                console.log('📝 Approving token spend...');
                const approveTx = await tokenContract.approve(contractAddress, amountIn);
                console.log(`Approval tx: ${approveTx.hash}`);
                await approveTx.wait();
                console.log('✅ Token approved!');
            } else {
                console.log('✅ Token already approved');
            }
            
            // Execute the swap
            await executeSwap(result.operation, result.encodedData, contractAddress);
            
        } else {
            console.log('\n❌ Swap cancelled by user');
        }
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
    
    rl.close();
}

/**
 * Command line usage
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // Interactive mode
        await interactiveSwap();
    } else if (args.length >= 3) {
        // Direct mode: node swapWithQuote.js BUSD CAKE 100
        const tokenIn = TOKENS[args[0].toUpperCase()];
        const tokenOut = TOKENS[args[1].toUpperCase()];
        const amount = ethers.utils.parseEther(args[2]);
        
        if (!tokenIn || !tokenOut) {
            console.error('Invalid token symbols');
            process.exit(1);
        }
        
        if (!process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
            console.error('Missing PRIVATE_KEY or CONTRACT_ADDRESS in .env');
            process.exit(1);
        }
        
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
        const result = await getQuoteWithConfirmation(
            tokenIn, 
            tokenOut, 
            amount, 
            wallet.address, 
            process.env.CONTRACT_ADDRESS
        );
        
        const confirmed = await askConfirmation('\nProceed with swap?');
        if (confirmed) {
            await executeSwap(result.operation, result.encodedData, process.env.CONTRACT_ADDRESS);
        }
        
        rl.close();
    } else {
        console.log('\nUsage:');
        console.log('  Interactive mode: node swapWithQuote.js');
        console.log('  Direct mode: node swapWithQuote.js <TOKEN_IN> <TOKEN_OUT> <AMOUNT>');
        console.log('  Example: node swapWithQuote.js BUSD CAKE 100');
        rl.close();
    }
}

// Run main function
main().catch(error => {
    console.error('Fatal error:', error);
    rl.close();
    process.exit(1);
});
