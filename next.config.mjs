/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optionally, disable image optimization (if needed)
    images: {
        unoptimized: true,
    },

    // Ensure fonts and other static files are properly handled
    async rewrites() {
        return [
            {
                source: '/fonts/:path*',
                destination: '/public/fonts/:path*', // This tells Next.js to serve fonts from public folder
            },
        ];
    },
};

export default nextConfig;
