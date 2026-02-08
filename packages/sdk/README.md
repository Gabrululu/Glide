# GLIDE SDK

Plug-and-play onboarding SDK for DeFi protocols. Reduce drop-off from 50% to 25% with gasless trials powered by Yellow Network.

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
        yellowApiKey: 'your_yellow_api_key',
        trialDays: 7,
        trialAmount: '0.1', // USDC
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
- ⚡ **Gasless Trials**: 7-day free trial with Yellow state channels
- 💰 **USDC Settlement**: Secure on-chain finalization via Arc
- 🎯 **ENS Integration**: Human-readable names for users

## Documentation

See [docs](./docs) for full API reference.
