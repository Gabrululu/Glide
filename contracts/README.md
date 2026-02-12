# Foundry Deployment Guide

## 🚀 Quick Start

### 1. Install Foundry (Required)

**Windows PowerShell (Run as Administrator):**
```powershell
# Download and run Foundry installer
curl -L https://foundry.paradigm.xyz | bash

# Restart your terminal, then run:
foundryup
```

**Verify installation:**
```bash
forge --version
cast --version
```

---

### 2. Configure Environment Variables

Edit `contracts/.env` and add:

```bash
# Your deployer wallet private key (needs Base Sepolia ETH)
DEPLOYER_PRIVATE_KEY=0xyour_private_key_here

# BaseScan API Key (optional, for verification)
BASESCAN_API_KEY=your_api_key_here
```

**Get Base Sepolia ETH:**
- https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

**Get BaseScan API Key:**
- https://basescan.org/myapikey

---

### 3. Install Dependencies

```bash
cd contracts
forge install foundry-rs/forge-std --no-commit
```

---

### 4. Build Contracts

```bash
forge build
```

---

### 5. Deploy TrialUSDC

```bash
forge script script/DeployTrialUSDC.s.sol:DeployTrialUSDC \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

**Copy the deployed address** and add to `contracts/.env`:
```bash
TRIAL_USDC_ADDRESS=0x...
```

---

### 6. Deploy GlideSession

```bash
forge script script/DeploySession.s.sol:DeploySession \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

---

### 7. Update App Configuration

Copy both addresses to `apps/demo/.env.local`:

```bash
NEXT_PUBLIC_TRIAL_USDC=0x...
NEXT_PUBLIC_SESSION_CONTRACT=0x...
```

---

## 📋 Project Structure

```
contracts/
├── foundry.toml              # Foundry configuration
├── .env                      # Environment variables
├── src/                      # Smart contracts
│   ├── TrialUSDC.sol
│   └── GlideSession.sol
├── script/                   # Deployment scripts
│   ├── DeployTrialUSDC.s.sol
│   └── DeploySession.s.sol
├── test/                     # Tests (optional)
└── lib/                      # Dependencies
    └── forge-std/
```

---

## 🔧 Useful Commands

### Build
```bash
forge build
```

### Test
```bash
forge test
forge test -vvv  # Verbose
```

### Clean
```bash
forge clean
```

### Format
```bash
forge fmt
```

### Verify Manually
```bash
forge verify-contract \
  <CONTRACT_ADDRESS> \
  src/TrialUSDC.sol:TrialUSDC \
  --chain base-sepolia \
  --etherscan-api-key $BASESCAN_API_KEY
```

---

## ❓ Troubleshooting

### "forge: command not found"
- Foundry not installed or not in PATH
- Restart terminal after installation
- Run `foundryup` again

### "insufficient funds"
- Need more Base Sepolia ETH
- Use faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

### "TRIAL_USDC_ADDRESS not set"
- Deploy TrialUSDC first
- Add address to `.env` file

### Verification fails
- Wait a few minutes after deployment
- Check BASESCAN_API_KEY is correct
- Try manual verification command

---

## ✅ Next Steps

After deployment:
1. ✅ Verify contracts on BaseScan
2. ✅ Update app `.env.local`
3. ✅ Restart dev server
4. ✅ Test in app
