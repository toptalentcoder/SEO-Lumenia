/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, //backend URL
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
