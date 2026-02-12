# Deployment Guide

## Prerequisites

1. **Get Base Sepolia ETH**:
   - Visit https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - Or use https://sepoliafaucet.com/

2. **Create a Deployer Wallet**:
   - Generate a new wallet (NEVER use your main wallet)
   - Export the private key
   - Fund it with ~0.05 ETH from faucet

3. **Get BaseScan API Key** (for verification):
   - Visit https://basescan.org/myapikey
   - Create account and generate API key

---

## Environment Setup

Add these to your `.env.local`:

```bash
# Deployer wallet (KEEP SECRET!)
DEPLOYER_PRIVATE_KEY=your_private_key_here

# BaseScan API key (for contract verification)
BASESCAN_API_KEY=your_basescan_api_key_here
```

---

## Deployment Steps

### 1. Install Dependencies

```bash
cd contracts
npm install
```

### 2. Compile Contracts

```bash
npm run compile
```

### 3. Deploy Trial USDC

```bash
npm run deploy:usdc
```

**Expected output:**
```
✅ TrialUSDC deployed to: 0x1234...
📝 Add this to your .env.local:
NEXT_PUBLIC_TRIAL_USDC=0x1234...
```

**Copy the address** and add it to `.env.local`

### 4. Deploy Session Contract

```bash
npm run deploy:session
```

**Expected output:**
```
✅ GlideSession deployed to: 0x5678...
📝 Add this to your .env.local:
NEXT_PUBLIC_SESSION_CONTRACT=0x5678...
```

**Copy the address** and add it to `.env.local`

### 5. Deploy Both at Once (Alternative)

```bash
npm run deploy:all
```

---

## Verification

Contracts are automatically verified on BaseScan during deployment.

To manually verify:

```bash
npm run verify:usdc -- <TRIAL_USDC_ADDRESS>
npm run verify:session -- <SESSION_CONTRACT_ADDRESS>
```

---

## Testing Contracts

### Test Trial USDC Faucet

```bash
npx hardhat console --network baseSepolia
```

```javascript
const TrialUSDC = await ethers.getContractFactory("TrialUSDC");
const usdc = await TrialUSDC.attach("YOUR_USDC_ADDRESS");

// Claim trial funds
await usdc.claimTrialFunds();

// Check balance
const balance = await usdc.balanceOf("YOUR_ADDRESS");
console.log("Balance:", balance.toString());
```

### Test Session Contract

```javascript
const GlideSession = await ethers.getContractFactory("GlideSession");
const session = await GlideSession.attach("YOUR_SESSION_ADDRESS");

// Create session
const tx = await session.createSession(
  "USER_ADDRESS",
  7, // 7 days
  ethers.parseUnits("100", 6) // 100 USDC
);
await tx.wait();

// Get session ID from events
const receipt = await tx.wait();
const event = receipt.logs[0];
console.log("Session created!");
```

---

## Troubleshooting

### "Insufficient funds"
- Get more ETH from faucet
- Each deployment costs ~0.01-0.02 ETH

### "Nonce too high"
- Reset your MetaMask/wallet
- Or wait a few minutes

### "Verification failed"
- Check BASESCAN_API_KEY is correct
- Contracts might already be verified
- Try manual verification

---

## Next Steps

After deployment:

1. ✅ Update `.env.local` with contract addresses
2. ✅ Restart dev server: `npm run dev`
3. ✅ Test faucet in app
4. ✅ Create a session
5. ✅ View transactions on BaseScan
