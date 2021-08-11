const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});
const withMDX = require("@next/mdx")({
    extension: /\.mdx?$/,
});

const config = {
    pageExtensions: ["js", "jsx", "mdx"],
    eslint: {
        // Warning: Dangerously allow production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

module.exports = withBundleAnalyzer(withMDX(config));
