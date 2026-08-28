import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isGitHubPages ? '/AWS_TTS' : '',
  assetPrefix: isGitHubPages ? '/AWS_TTS/' : '',
  images: { unoptimized: true },
};

export default nextConfig;
