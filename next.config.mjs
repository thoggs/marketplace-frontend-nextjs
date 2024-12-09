/** @type {import('next').NextConfig} */

const nextConfig = {
    sassOptions: {
        prependData: `@use "./_mantine.scss" as *;`,
        silenceDeprecations: ["legacy-js-api"],
    },
    output: 'standalone',
};

export default nextConfig;
