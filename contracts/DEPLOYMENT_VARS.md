# Variables Necesarias para Deployment

Para desplegar los contratos en Base Sepolia, necesitas agregar estas variables a tu archivo `.env.local` en el directorio `contracts/`:

## 📝 Variables Requeridas

### 1. DEPLOYER_PRIVATE_KEY (Requerido)
Tu clave privada de la wallet que desplegará los contratos.

```bash
DEPLOYER_PRIVATE_KEY=tu_clave_privada_aqui
```

**⚠️ IMPORTANTE:**
- Esta wallet necesita tener ETH en Base Sepolia para pagar el gas
- **NUNCA** compartas esta clave privada
- **NUNCA** la subas a GitHub
- Usa una wallet de prueba, no tu wallet principal

**Cómo obtener Base Sepolia ETH:**
1. Ve a: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. O usa: https://faucet.quicknode.com/base/sepolia

---

### 2. BASESCAN_API_KEY (Opcional pero recomendado)
Para verificar automáticamente tus contratos en BaseScan.

```bash
BASESCAN_API_KEY=tu_api_key_aqui
```

**Cómo obtener:**
1. Ve a: https://basescan.org/
2. Crea una cuenta
3. Ve a "API Keys" en tu perfil
4. Crea un nuevo API Key

---

## 📁 Ubicación del archivo

Crea el archivo `.env.local` en el directorio `contracts/`:

```
d:\0xProyectos\Glide\contracts\.env.local
```

## 📋 Ejemplo completo de .env.local

```bash
# Deployer Wallet (REQUERIDO)
DEPLOYER_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# BaseScan API Key (OPCIONAL)
BASESCAN_API_KEY=ABC123XYZ456
```

---

## 🚀 Pasos para Deployment

Una vez que tengas las variables configuradas:

```bash
# 1. Ir al directorio de contratos
cd contracts

# 2. Instalar dependencias (si no lo has hecho)
npm install

# 3. Desplegar TrialUSDC
npm run deploy:usdc

# 4. Desplegar GlideSession
npm run deploy:session
```

---

## ✅ Después del Deployment

Los scripts te darán las direcciones de los contratos desplegados. Debes copiarlas a tu `.env.local` principal:

```bash
# En: d:\0xProyectos\Glide\apps\demo\.env.local

NEXT_PUBLIC_TRIAL_USDC=0xDireccionDelContratoUSDC
NEXT_PUBLIC_SESSION_CONTRACT=0xDireccionDelContratoSession
```

---

## 🔍 Verificación

Si todo salió bien, verás:
- ✅ Contratos desplegados en Base Sepolia
- ✅ Contratos verificados en BaseScan (si agregaste API key)
- ✅ Links para ver los contratos en el explorer

---

## ❓ Troubleshooting

**Error: "insufficient funds"**
- Necesitas más ETH en Base Sepolia
- Usa el faucet mencionado arriba

**Error: "invalid private key"**
- Asegúrate de que la clave privada empiece con `0x`
- Verifica que sea la clave privada completa (64 caracteres hex)

**Verificación falla**
- Espera unos minutos y vuelve a intentar
- Verifica que tu BASESCAN_API_KEY sea correcta
