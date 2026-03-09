/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for faster builds
  swcMinify: true,

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Experimental features for optimization
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@monaco-editor/react', 'react-markdown'],
  },

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Disable source maps in production to reduce build time
    productionBrowserSourceMaps: false,
  }),
};

module.exports = nextConfig;
