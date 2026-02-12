# GLIDE - Agentic Finance for DeFi

🤖 **Reduce onboarding drop-off from 50% to 25%** with AI agents that simplify DeFi complexity, powered by Uniswap v4, Arc, and Privy.

## 🎯 What is GLIDE?

GLIDE is an agentic finance platform that uses AI to make DeFi accessible to everyone:

- **No seed phrases**: Email/social login via Privy embedded wallets
- **AI-powered strategies**: Agents analyze markets and suggest optimal yield strategies
- **Plain English**: No confusing terms like "impermanent loss" or "liquidity pools"
- **Uniswap v4 integration**: Access to cutting-edge DeFi infrastructure with Hooks
- **ENS integration**: Human-readable names for users and protocols

## 📊 The Problem

- **50%+ drop-off** during traditional DeFi onboarding
- Users are **overwhelmed** by complex terminology (APY, TVL, IL, pools, ticks)
- Understanding yield strategies requires deep DeFi knowledge
- No guidance on which protocols or strategies to use

## ✨ The Solution

GLIDE provides an **AI agent that does the thinking for you**:

1. User enters email → wallet created automatically
2. Agent scans Uniswap v4 pools and analyzes market conditions
3. Agent suggests strategies in plain English: "Low Risk Income" or "Growth Strategy"
4. User clicks "Deploy" → Agent executes optimal positions automatically

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

### Uniswap v4 - Agentic Finance ($5,000)
- ✅ Agent-driven financial systems on Uniswap v4
- ✅ Programmatic pool interaction and liquidity management
- ✅ Transparent, reliable agent behavior
- ✅ Composable onchain state management

### Arc 
- ✅ Uses Arc for USDC settlement
- ✅ Chain abstraction for liquidity
- ✅ Global payout system

### ENS 
- ✅ Creative use: user.glide.eth naming
- ✅ Protocol reputation via ENS
- ✅ Text records for user preferences

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
- **DeFi Layer**: Uniswap v4 (Pools + Hooks)
- **Agent Logic**: TypeScript-based decision engine
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
