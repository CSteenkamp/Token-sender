import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cardano Token Sender',
  description: 'Send ADA and native tokens on the Cardano blockchain',
  keywords: 'cardano, ada, blockchain, crypto, tokens, send',
  icons: {
    icon: '/cardano-icon.svg',
    shortcut: '/cardano-icon.svg',
    apple: '/cardano-icon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="min-h-screen">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cardano-blue rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">₳</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Cardano Token Sender
                  </h1>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
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
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}