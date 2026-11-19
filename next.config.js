/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    turbopack: { root: __dirname },
    outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
