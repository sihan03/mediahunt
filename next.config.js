/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  env: {
    // These will be available at build-time but don't get exposed to browser
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
  images: {
    remotePatterns: [
      // Authentication providers
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile images
      },
      {
        protocol: 'https', 
        hostname: '**.googleusercontent.com', // Catch all Google user content
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // Google Storage for some avatars
      },
      
      // Tech news/media sources
      {
        protocol: 'https',
        hostname: 'www.technologyreview.com',
      },
      {
        protocol: 'https',
        hostname: 'tldr.tech',
      },
      {
        protocol: 'https',
        hostname: '**.medium.com',
      },
      {
        protocol: 'https',
        hostname: 'techcrunch.com',
      },
      {
        protocol: 'https',
        hostname: '**.techcrunch.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.substack.com', // For newsletter thumbnails
      },
      {
        protocol: 'https',
        hostname: '**.substack.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // YouTube thumbnails
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com', // YouTube channel icons
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com', // YouTube channel icons (newer)
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com', // Twitter images
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com', // Twitter avatars
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub avatars
      },
      {
        protocol: 'https',
        hostname: 'openai.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.openai.com',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      }
    ],
  },
};

module.exports = nextConfig; 