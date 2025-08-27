/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  experimental: {
    serverComponentsExternalPackages: ['@meshsdk/core', '@meshsdk/react'],
  },
  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    
    // Completely exclude WASM files from server-side processing
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@meshsdk/core': false,
        '@meshsdk/react': false,
        '@sidan-lab/sidan-csl-rs-nodejs': false,
      };
      config.externals = [...(config.externals || []), '@meshsdk/core', '@meshsdk/react'];
    } else {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig