import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cardano Token Sender',
  description: 'Send ADA and native tokens on the Cardano blockchain',
  keywords: 'cardano, ada, blockchain, crypto, tokens, send',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="min-h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cardano-blue rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">₳</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Cardano Token Sender
                  </h1>
                </div>
                <div className="text-sm text-gray-500">
                  Preprod Testnet
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center text-sm text-gray-500">
                <p>
                  Built with{' '}
                  <a
                    href="https://meshjs.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cardano-blue hover:text-cardano-light"
                  >
                    MeshJS
                  </a>{' '}
                  for the Cardano blockchain
                </p>
                <p className="mt-1">
                  ⚠️ This app uses the Preprod testnet. Do not send real ADA or tokens.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}