import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config, { isServer }) => {
        config.resolve.alias['@'] = resolve(__dirname, './');
        return config;
    },
    env: {
        PHANTOM_PRIVATE_KEY: process.env.PHANTOM_PRIVATE_KEY,
    },
};

export default nextConfig;
