# Cardano Token Sender

A simple, clean React web application for sending ADA and native tokens on the Cardano blockchain. Built with Next.js, MeshJS, and TailwindCSS.

🚀 **Version 1.0** - Production Ready

![Cardano Token Sender](https://img.shields.io/badge/Cardano-Token%20Sender-blue?style=for-the-badge&logo=cardano)

## Features

✅ **Multi-Wallet Support**: Connect with Nami, Eternl, Flint, or Lace wallets  
✅ **Balance Display**: View ADA balance and native tokens  
✅ **Token Sending**: Send ADA or any native tokens from your wallet  
✅ **Transaction Tracking**: Get transaction hash with Cardanoscan link  
✅ **Testnet Ready**: Configured for Cardano preprod testnet  
✅ **Responsive Design**: Clean, minimal UI with TailwindCSS  
✅ **Production Ready**: Optimized for deployment to Vercel/Netlify  

## Prerequisites

Before running the application, make sure you have:

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- A **Cardano wallet** (Nami, Eternl, Flint, or Lace) installed in your browser
- **Testnet ADA** from the [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd cardano-token-sender
npm install
```

### 2. Environment Setup (Optional)

Copy the environment example file:

```bash
cp .env.example .env.local
```

The app works with default settings for preprod testnet, but you can customize:

```env
NEXT_PUBLIC_CARDANO_NETWORK=preprod
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Connect Your Wallet

1. Install one of the supported wallets (Nami, Eternl, Flint, or Lace)
2. Set your wallet to **Preprod Testnet**
3. Get testnet ADA from the [faucet](https://docs.cardano.org/cardano-testnet/tools/faucet)
4. Click "Connect Wallet" and select your wallet

### 5. Send Transactions

1. View your ADA balance and available tokens
2. Enter a recipient address
3. Select ADA or a native token
4. Enter the amount to send
5. Click "Send Transaction"
6. Confirm in your wallet
7. View the transaction on Cardanoscan

## Project Structure

```
cardano-token-sender/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with MeshProvider
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles and Tailwind
├── components/            # React components
│   ├── WalletConnection.tsx   # Multi-wallet connection
│   ├── WalletBalance.tsx     # Balance and token display
│   ├── SendForm.tsx          # Transaction form
│   └── TransactionResult.tsx # Success modal
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── README.md             # This file
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Vercel will automatically detect it's a Next.js app
4. Deploy with default settings

### Netlify

1. Run `npm run build` to generate the build
2. Upload the `.next` folder to Netlify
3. Or connect your Git repository for automatic deployments

### Environment Variables for Production

If using custom RPC endpoints, set these in your deployment platform:

```
NEXT_PUBLIC_CARDANO_NETWORK=preprod
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=your_project_id
NEXT_PUBLIC_BLOCKFROST_URL=https://cardano-preprod.blockfrost.io/api/v0
```

## Supported Wallets

| Wallet | Status | Notes |
|--------|--------|-------|
| **Nami** | ✅ | Most popular Cardano wallet |
| **Eternl** | ✅ | Feature-rich with staking |  
| **Flint** | ✅ | Lightweight and fast |
| **Lace** | ✅ | Official Input Output wallet |

## Network Configuration

The app is configured for **Cardano Preprod Testnet** by default:

- **Network**: Preprod Testnet
- **Explorer**: [preprod.cardanoscan.io](https://preprod.cardanoscan.io)
- **Faucet**: [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet)

## Security Notes

⚠️ **Important Security Information:**

- This app is for **testnet use only**
- Never enter mainnet private keys or seed phrases
- Always verify recipient addresses before sending
- Test with small amounts first
- The app does not store private keys or sensitive information

## Technologies Used

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[MeshJS](https://meshjs.dev/)** - Cardano blockchain integration
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

## Common Issues

### Wallet Not Detected
- Ensure your wallet extension is installed and unlocked
- Refresh the page after installing a new wallet
- Check that the wallet supports the Cardano network

### Transaction Failed
- Verify you have enough ADA for transaction fees (~0.17 ADA minimum)
- Check that the recipient address is valid
- Ensure your wallet is connected to preprod testnet

### Balance Not Loading
- Click the "Refresh" button in the wallet balance section
- Ensure your wallet is properly connected
- Check your internet connection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:

1. Check the [Common Issues](#common-issues) section
2. Review the [MeshJS Documentation](https://meshjs.dev/docs)
3. Open an issue in this repository

---

Built with ❤️ for the Cardano ecosystem