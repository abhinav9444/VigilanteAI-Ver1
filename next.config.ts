import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
  },
  allowedDevOrigins: [
    'https://6000-firebase-studio-1761573637053.cluster-aic6jbiihrhmyrqafasatvzbwe.cloudworkstations.dev',
  ],
  env: {
    VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY,
    WHOISXML_API_KEY: process.env.WHOISXML_API_KEY,
    SHODAN_API_KEY: process.env.SHODAN_API_KEY,
    SSLMATE_API_KEY: process.env.SSLMATE_API_KEY,
  }
};

export default nextConfig;
