
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const client = createPublicClient({
    chain: baseSepolia,
    transport: http()
});

async function main() {
    try {
        console.log('Testing ENS on Base Sepolia...');
        const name = 'jesse.base.eth'; // Known basename / or try 'vitalik.eth' to see if it resolves via L1
        const address = await client.getEnsAddress({ name });
        console.log(`Address for ${name}: ${address}`);

        const reverseName = await client.getEnsName({ address: '0x1234567890123456789012345678901234567890' as `0x${string}` });
        console.log('Reverse resolution:', reverseName);
    } catch (error) {
        console.error('ENS Error:', error);
    }
}

main();
