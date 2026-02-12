/**
 * Contract addresses and ABIs for Base Sepolia testnet
 */

// Base Sepolia Chain ID
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// Contract Addresses (will be updated after deployment)
export const CONTRACTS = {
    // Glide Contracts (deployed by us)
    SESSION_CONTRACT: process.env.NEXT_PUBLIC_SESSION_CONTRACT || '0x0000000000000000000000000000000000000000',
    TRIAL_USDC: process.env.NEXT_PUBLIC_TRIAL_USDC || '0x0000000000000000000000000000000000000000',

    // Uniswap V4 (official contracts on Base Sepolia)
    // Source: https://docs.uniswap.org/contracts/v4/deployments
    UNISWAP_V4_POOL_MANAGER: '0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408',
    UNISWAP_V4_UNIVERSAL_ROUTER: '0x492e6456d9528771018deb9e87ef7750ef184104',
    UNISWAP_V4_POSITION_MANAGER: '0x4b2c77d209d3405f41a037ec6c77f7f5b8e2ca80',
    UNISWAP_V4_STATE_VIEW: '0x571291b572ed32ce6751a2cb2486ebee8defb9b4',
    UNISWAP_V4_QUOTER: '0x4a6513c898fe1b2d0e78d3b0e0a4a151589b1cba',
    UNISWAP_V4_POOL_SWAP_TEST: '0x8b5bcc363dde2614281ad875bad385e0a785d3b9',
    UNISWAP_V4_POOL_MODIFY_LIQUIDITY_TEST: '0x37429cd17cb1454c34e7f50b09725202fd533039',
    UNISWAP_V4_PERMIT2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',

    // Tokens on Base Sepolia
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
};

// Network Configuration
export const NETWORK_CONFIG = {
    chainId: BASE_SEPOLIA_CHAIN_ID,
    name: 'Base Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
    },
};

// ERC20 ABI (minimal)
export const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
] as const;

// Trial USDC ABI
export const TRIAL_USDC_ABI = [
    ...ERC20_ABI,
    'function claimTrialFunds() external',
    'function canClaimFaucet(address user) view returns (bool)',
    'function timeUntilNextClaim(address user) view returns (uint256)',
    'function FAUCET_AMOUNT() view returns (uint256)',
] as const;

// Glide Session ABI
export const GLIDE_SESSION_ABI = [
    'function createSession(address user, uint256 trialDays, uint256 initialBalance) returns (bytes32)',
    'function recordTransaction(bytes32 sessionId, string txType, uint256 amount, string details, uint256 gasSaved)',
    'function updateBalance(bytes32 sessionId, uint256 newBalance)',
    'function settleSession(bytes32 sessionId)',
    'function getSession(bytes32 sessionId) view returns (tuple(address user, uint256 startTime, uint256 endTime, uint256 initialBalance, uint256 currentBalance, bool isActive, uint256 transactionCount, uint256 gasSaved))',
    'function getUserSessions(address user) view returns (bytes32[])',
    'function getTransactionCount(bytes32 sessionId) view returns (uint256)',
    'function isSessionExpired(bytes32 sessionId) view returns (bool)',
    'function getRemainingTime(bytes32 sessionId) view returns (uint256)',
] as const;

// Uniswap V4 PoolManager ABI (minimal)
export const UNISWAP_V4_POOL_MANAGER_ABI = [
    'function initialize(tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks) key, uint160 sqrtPriceX96) returns (int24)',
    'function swap(tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks) key, tuple(bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96) params, bytes hookData) returns (int256, int256)',
    'function modifyLiquidity(tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks) key, tuple(int24 tickLower, int24 tickUpper, int256 liquidityDelta, bytes32 salt) params, bytes hookData) returns (int256, int256)',
    'function getSlot0(bytes32 poolId) view returns (uint160 sqrtPriceX96, int24 tick, uint24 protocolFee, uint24 lpFee)',
    'function getLiquidity(bytes32 poolId) view returns (uint128)',
] as const;

// Uniswap V4 Quoter ABI (minimal)
export const UNISWAP_V4_QUOTER_ABI = [
    'function quoteExactInputSingle(tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks) poolKey, tuple(bool zeroForOne, uint128 exactAmount, uint160 sqrtPriceLimitX96, bytes hookData) params) returns (uint256 amountOut, uint256 gasEstimate)',
    'function quoteExactInput(bytes path, uint128 exactAmountIn) returns (uint256 amountOut, uint256 gasEstimate)',
] as const;

// Helper to get block explorer URL
export function getExplorerUrl(type: 'tx' | 'address' | 'token', value: string): string {
    const base = NETWORK_CONFIG.blockExplorer;
    switch (type) {
        case 'tx':
            return `${base}/tx/${value}`;
        case 'address':
            return `${base}/address/${value}`;
        case 'token':
            return `${base}/token/${value}`;
        default:
            return base;
    }
}

// Helper to check if contracts are deployed
export function areContractsDeployed(): boolean {
    return (
        CONTRACTS.SESSION_CONTRACT !== '0x0000000000000000000000000000000000000000' &&
        CONTRACTS.TRIAL_USDC !== '0x0000000000000000000000000000000000000000'
    );
}
