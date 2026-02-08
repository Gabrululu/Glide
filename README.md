# GLIDE - OnboardKit for DeFi

🚀 **Reduce onboarding drop-off from 50% to 25%** with instant, gasless DeFi onboarding powered by Yellow Network, Arc, and Privy.

## 🎯 What is GLIDE?

GLIDE is a plug-and-play SDK that DeFi protocols can integrate in 5 minutes to dramatically improve user onboarding:

- **No seed phrases**: Email/social login via Privy embedded wallets
- **7-day gasless trial**: Powered by Yellow Network state channels
- **Secure settlement**: Final balance settles on Arc blockchain with USDC
- **ENS integration**: Human-readable names for users and protocols

## 📊 The Problem

- **50%+ drop-off** during traditional DeFi onboarding
- Users spend **hours** setting up wallets, buying crypto, and bridging
- Complex seed phrases scare away new users
- Gas fees create friction before users even try the product

## ✨ The Solution

GLIDE provides a **2-minute onboarding flow**:

1. User enters email → wallet created automatically
2. Receives 0.1 USDC trial balance
3. Makes swaps, stakes, trades **gasless** for 7 days
4. Converts to paid user after experiencing the product

## 🏗️ Project Structure

```
glide/
├── packages/
│   └── sdk/                 # Core GLIDE SDK
│       ├── src/
│       │   ├── GlideProvider.tsx
│       │   ├── hooks/useGlide.ts
│       │   └── services/
│       │       ├── YellowService.ts
│       │       ├── ArcService.ts
│       │       └── ENSService.ts
│       └── package.json
├── apps/
│   └── demo/                # Demo DeFi app
│       ├── app/
│       │   ├── page.tsx
│       │   └── dashboard/
│       └── components/
│           ├── LandingPage.tsx
│           ├── SwapInterface.tsx
│           └── TrialBanner.tsx
└── package.json
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local` in `apps/demo/`:

```bash
cp .env.example apps/demo/.env.local
```

Add your API keys:
- **Privy App ID**: Get from [privy.io](https://privy.io)
- **Yellow API Key**: Get from [yellow.org](https://yellow.org)

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the demo app.

## 📦 Using GLIDE in Your DeFi Protocol

### Installation

```bash
npm install @glide/sdk
```

### Integration

```tsx
import { GlideProvider, useGlide } from '@glide/sdk';

function App() {
  return (
    <GlideProvider
      config={{
        privyAppId: 'your_privy_app_id',
        yellowApiKey: 'your_yellow_api_key',
        trialDays: 7,
        trialAmount: '0.1',
      }}
    >
      <YourDeFiApp />
    </GlideProvider>
  );
}

function OnboardButton() {
  const { createSession } = useGlide();
  
  return (
    <button onClick={() => createSession()}>
      Get Started
    </button>
  );
}
```

## 🏆 Hackathon Bounties

This project qualifies for:

### Yellow Network 
- ✅ Integrates Yellow SDK for state channels
- ✅ Demonstrates gasless transactions
- ✅ Shows session-based spending

### Arc 
- ✅ Uses Arc for USDC settlement
- ✅ Chain abstraction for liquidity
- ✅ Global payout system (trial funding)

### ENS 
- ✅ Creative use: user.glide.eth naming
- ✅ Protocol reputation via ENS
- ✅ Text records for preferences

## 💰 Business Model

**Pay-per-conversion**: Protocols pay $0.50 per successfully onboarded user

**ROI for protocols**:
- Current conversion: 45% (450/1000 users)
- With GLIDE: 75% (750/1000 users)
- Cost: $375 (750 × $0.50)
- Additional value: $15,000 (300 × $50 LTV)
- **Net gain: $12,750 (566% ROI)**

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Wallet**: Privy embedded wallets
- **State Channels**: Yellow Network Nitrolite
- **Settlement**: Arc blockchain
- **Naming**: ENS
- **Monorepo**: Turborepo

## 🎥 Demo

[Demo video will be added here]

## 📄 License

MIT

## 🤝 Contributing

This is a hackathon project. Contributions welcome after initial submission!

---

Built with ❤️ for ETHGlobal Hackathon
