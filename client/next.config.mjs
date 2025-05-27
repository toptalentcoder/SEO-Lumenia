/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
<<<<<<< HEAD
                destination: 'http://localhost:7777/api/:path*', //backend URL
=======
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, //backend URL
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
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
