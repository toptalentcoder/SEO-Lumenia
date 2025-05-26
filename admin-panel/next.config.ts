import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com"], // ✅ Allow Google profile images
    },
};

export default nextConfig;
