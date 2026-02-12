# GLIDE SDK

Agentic Finance SDK for DeFi. Reduce drop-off from 50% to 25% with AI agents that simplify DeFi complexity.

## Installation

```bash
npm install @glide/sdk
```

## Quick Start

```tsx
import { GlideProvider, useGlide } from '@glide/sdk';

function App() {
  return (
    <GlideProvider
      config={{
        privyAppId: 'your_privy_app_id',
        trialDays: 7,
        trialAmount: '1000', // USDC
      }}
    >
      <YourDeFiApp />
    </GlideProvider>
  );
}

function OnboardButton() {
  const { createSession, session } = useGlide();

  return (
    <button onClick={() => createSession()}>
      {session ? 'Dashboard' : 'Get Started'}
    </button>
  );
}
```

## Features

- 🚀 **Instant Onboarding**: Email login, no seed phrases
- 🤖 **AI Agents**: Automated yield optimization on Uniswap v4
- 💰 **USDC Settlement**: Secure on-chain finalization via Arc
- 🎯 **ENS Integration**: Human-readable names for users

## Documentation

See [docs](./docs) for full API reference.
