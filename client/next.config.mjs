/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:7777/api/:path*', //backend URL
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/(.*)', // Apply the header to all routes
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin', // Allow interaction between windows of the same origin
                    },
                ],
            },
        ];
    },
    images: {
        domains: ["lh3.googleusercontent.com"], // ✅ Allow Google profile images
    },
    devIndicators : false,
};

export default nextConfig;
