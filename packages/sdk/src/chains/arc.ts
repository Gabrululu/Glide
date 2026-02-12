import { defineChain } from 'viem';

const ARC_RPC = process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.arc.network';
const ARC_EXPLORER = process.env.NEXT_PUBLIC_ARC_EXPLORER_URL || 'https://explorer.testnet.arc.network';
const ARC_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_ARC_CHAIN_ID || '1234');

export const arc = defineChain({
    id: ARC_CHAIN_ID,
    name: 'Arc Network',
    network: 'arc',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: [ARC_RPC],
        },
        public: {
            http: [ARC_RPC],
        },
    },
    blockExplorers: {
        default: { name: 'Arc Explorer', url: ARC_EXPLORER },
    },
    testnet: true,
});
